import Users from '../Models/User.js'
import { StatusCodes } from 'http-status-codes'
import {BadRequistError} from '../Errors/index.js'



const register = async (req , res, next)=> {
    const {name, email, password} = req.body;

    if(!name || !email || !password){
        throw new BadRequistError("Please provide all values.")
    }
    //check if user exist
    const userAlreadyExist = await Users.findOne({email});
    if(userAlreadyExist) {
        const firstLetter = email[0];
        const restOfEmail = email.slice(email.length - 10)
        throw new BadRequistError(`${firstLetter +'*****'+ restOfEmail} email already in use.`)
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
    res.status(StatusCodes.OK).json({user:{
        name:user.name,
        email:user.email,
        location:user.location,
        lastname:user.lastName
    }, token})               
    
    
}
const login = (req , res)=> {
    res.send('login user')
}

const updateUser = (req , res)=> { 
    res.send('updateUser')
}

export {
    register,
    login,
    updateUser
}