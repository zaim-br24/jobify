

const createJob = (req, res)=>{
    res.send('create Job')
}
const deleteJob = (req, res)=>{
    res.send('delete Job')
}

const getAllJobs = (req, res)=>{
    res.send('get all  Jobs')
}
const updateJob = (req, res)=>{
    res.send('update Job')
}
const showStats = (req, res)=>{
    res.send('show stats')
}


export {
    createJob,
    updateJob,
    deleteJob,
    getAllJobs,
    showStats
}