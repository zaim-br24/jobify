import Users from '../Models/User.js'
import { StatusCodes } from 'http-status-codes'
import {BadRequestError, UnauthenticatedError} from '../Errors/index.js'



const register = async (req , res, next)=> {
    const {name, email, password} = req.body;

    if(!name || !email || !password){
        throw new BadRequestError("Please provide all values.")
    }
    //check if user exist
    const userAlreadyExist = await Users.findOne({email});
    if(userAlreadyExist) {
        const firstLetter = email[0];
        const restOfEmail = email.slice(email.length - 10)
        throw new BadRequestError(`${firstLetter +'*****'+ restOfEmail} email already in use.`)        
    }
    //create a user
    const  user =  await Users.create({
        name,
        email,
        password
    })
    //calling the createJWT coming from User schema to create a token (unique key)
   const token =  user.createJWT()
   //returning the user object without the PASSWORD
    res.status(StatusCodes.CREATED).json({user:{
        name:user.name,
        email:user.email,
        lastName:user.lastName,
        location: user.location
    }, token, location:user.location,})               
    
    
}
const login = async (req , res)=> {
    const { email, password } = req.body
    if (!email || !password) {
      throw new BadRequestError('Please provide all values')
    }
    const user = await Users.findOne({ email }).select('+password')
  
    if (!user) {
      throw new UnauthenticatedError('Invalid Values!')
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
      throw new UnauthenticatedError('Invalid Credentials!')
    }
    const token = user.createJWT();

    res.status(StatusCodes.OK).json({user:{
        name:user.name,
        email:user.email,
        lastName:user.lastName,
        location: user.location

    }, token, location:user.location,})
}

const updateUser = async (req , res)=> { 
    const {name, email, lastName, location} = req.body
    if (!email || !name || !lastName || !location) {
        throw new BadRequestError('Please provide all values')
    }
    const user = await Users.findOne({_id: req.user.userId})

    user.name = name;
    user.email = email;
    user.location = location;
    user.lastName = lastName

    await user.save()

    const token = user.createJWT()
    res.status(StatusCodes.OK).json({user:{
        name:user.name,
        email:user.email,
        lastName:user.lastName,
        location: user.location

    }, token, location:user.location,})

}

export {
    register,
    login,
    updateUser
}