import jwt  from "jsonwebtoken"
import { UnauthenticatedError } from "../Errors/index.js"
const auth = async (req, res, next)=>{
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer') ){
        throw new UnauthenticatedError('authentication invalid')
    }
    const token = authHeader.split(' ')[1]
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.user = {userId : payload.userId}
        // console.log(payload)
        // console.log(req.user)


        next() 
    } catch (error) {
        throw new UnauthenticatedError('authentication invalid')
    }
    
}

export default auth