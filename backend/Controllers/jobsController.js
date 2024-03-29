import Job from '../Models/Job.js'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, NotFoundError } from '../Errors/index.js'
import checkPermissions from '../utils/checkPremissions.js'
import mongoose from 'mongoose'
import moment from 'moment'


const createJob = async (req, res) => {
    const { position, company } = req.body
  
    if (!position || !company) {
      throw new BadRequestError('Please Provide All Values')
    }
  
    req.body.createdBy = req.user.userId
  
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({ job })
  }
  
  const deleteJob = async (req, res) => {
    const { id: jobId } = req.params
  
    const job = await Job.findOne({ _id: jobId })
  
    if (!job) {
      throw new CustomError.NotFoundError(`No job with id : ${jobId}`)
    }
  
    checkPermissions(req.user, job.createdBy) // check if this user is allowed to delete this post

    // await Job.findOneAndRemove({_id: jobId}) // we can use job.remove()
  
    await job.remove()
    res.status(StatusCodes.OK).json({ msg: 'Success! Job removed' })
  }

const getAllJobs = async (req, res)=>{
  const {status, jobType, sort, search} = req.query

    const queryObject = {
      createdBy:req.user.userId
    }
    
    // filter
    if(status !== 'all'){ queryObject.status = status}
    if(jobType !== 'all'){ queryObject.jobType = jobType}
    if(search){
      queryObject.position = {$regex: search, $options:'i'} //i => case sensitive
    }
    let result = Job.find(queryObject);
    // chain sort conditions
    if (sort === 'latest') {
      result = result.sort('-createdAt')
    }
    if (sort === 'oldest') {
      result = result.sort('createdAt')
    }
    if (sort === 'a-z') {
      result = result.sort('position')
    }
    if (sort === 'z-a') {
      result = result.sort('-position')
    }
      // setup pagination
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip = (page - 1) * limit //10
  result = result.skip(skip).limit(limit)
  // 75
  // 10 10 10 10 10 10 10 5
    const totalJobs = await Job.countDocuments(queryObject);
    const numOfPages = Math.ceil(totalJobs / limit)
    const jobs = await result 

    // DONOT USE AWAIT SO THAT WE CAN ADD THE CONDITIONS FIRST
    res.status(StatusCodes.OK).json({jobs, totalJobs, numOfPages})
}
const updateJob = async (req, res)=>{
    const {id: jobId} = req.params
    const {company, position}= req.body;

    if(!company || !position){
        throw new BadRequestError("Please provide all values")
    }

    const job = await Job.findById({_id: jobId});
    if(!job){
        throw new   NotFoundError(`No job with id ${jobId} was found`)
    }

    checkPermissions(req.user, job.createdBy)
    const updatedJob = await Job.findOneAndUpdate({_id: jobId}, req.body, {
        new: true,
        runValidators: true,
    })

    // console.log(typeof req.user.userId)
    // console.log(typeof job.createdBy)

    // Alternative approach (if we have a hook in the jobSchema its better to use this approach because it allows you to trigger the hooks)

    // job.position = position;
    // job.company = company;

    // await job.save()

    res.status(StatusCodes.OK).json({updatedJob})
}

const showStats = async(req, res)=>{

  let stats = await Job.aggregate([
    {$match: {createdBy: mongoose.Types.ObjectId(req.user.userId)}}, //we get all the jobs of a user
    {$group: {_id:"$status", count: {$sum : 1}}}, // we group the status  { _id: "declined", count: 23} , (pending, interview )
  ])
 
  stats = stats.reduce((acc , curr)=>{  //   { 'interview': 25, 'pending': 13, 'declined': 20}
    const {_id: title, count} = curr;
    acc[title]= count
    return acc
  }, {})

  const defaultStats= {
    interview: stats.interview || 0,
    declined: stats.declined || 0,
    pending: stats.pending || 0,
  }

  let monthlyApplications = await Job.aggregate([
    {$match :{createdBy: mongoose.Types.ObjectId(req.user.userId)}},
    {$group: { 
      _id : {year:{ $year: '$createdAt'}, month: {$month: '$createdAt'}},
      count: {$sum: 1 }
    }},
    {$sort: {'_id.year': -1, '_id.month': -1}}, // to get the latest jobs
    {$limit: 6} // we get 6 from the sorted jobs (this means we will only select the 6 latest jobs)
  ])
  monthlyApplications = monthlyApplications.map((item)=>{
    const {_id :{year, month}, count} = item;

    let date = moment().year(year).month(month).format('MMM Y') // date = "Aug 2021"
    return {date , count}
  }).reverse() // we reverse() because we selected jobs starting from the oldest
  
  res.status(StatusCodes.OK).json({defaultStats, monthlyApplications})
}


export {
    createJob,
    updateJob,
    deleteJob,
    getAllJobs,
    showStats
}