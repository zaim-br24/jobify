import Users from '../Models/User.js'
import { StatusCodes } from 'http-status-codes'
import {BadRequistError} from '../Errors/index.js'



const register = async (req , res, next)=> {
    const {name, email, password} = req.body;
    if(!name || !email || !password){
        throw new BadRequistError("Please provide all values.")
    }
    const userAlreadyExist = await Users.findOne({email});
    if(userAlreadyExist) {
        const firstLetter = email[0];
        
        const restOfEmail = email.slice(email.length - 10)
        throw new BadRequistError(`${firstLetter +'*****'+ restOfEmail} email already in use.`)
    }
    //create a user
    const  createdUser =  await Users.create(req.body)
    res.status(StatusCodes.OK).json(createdUser)               
    
    
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