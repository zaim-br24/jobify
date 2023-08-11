import dotenv from "dotenv";
dotenv.config()
import express  from 'express'
import 'express-async-errors'
import morgan from "morgan";
// import cors from 'cors'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import path from 'path'
// security
import helmet from 'helmet'
import xss from 'xss-clean'
import mongoSanitize from 'express-mongo-sanitize'


const __dirname = dirname(fileURLToPath(import.meta.url))

const app = express();
// DB and authentication
import connectDB from "./db/connect.js";

// Middleware
import notFoundMiddleware from './middleware/not-found.js'
import errorHandlerMiddleware from './middleware/error-handler.js'
import authenticateUser from './middleware/auth.js'
import authRouter from "./Router/authRouter.js";
import jobsRouter from './Router/jobsRouter.js'

if(process.env.NODE_ENV !== 'production'){
    app.use(morgan('dev'))
}
app.use(express.json())
app.use(helmet()) //secure headers
app.use(xss()) //Sanitize the inputs (prevent cross-site-scripting)
app.use(mongoSanitize())// prevent mongoDB injections 
// app.use(cors)
// only when ready to deploy
app.use(express.static(path.resolve(__dirname, './client/build')))

//routes
app.use("/api/v1/auth", authRouter );
app.use("/api/v1/jobs",authenticateUser, jobsRouter );

app.get('*', function (request, response) {
    response.sendFile(path.resolve(__dirname, './client/build', 'index.html'))
  })
app.use(notFoundMiddleware )
app.use(errorHandlerMiddleware)


// server listening
const port = process.env.PORT || 5000
const start = async ()=>{
    try {
        await connectDB(process.env.DB_URL, process.env.DB_PASSWORD)
        console.log("connected to mongoDB successfully...!")
        app.listen(port, ()=> console.log(`server listening on port ${port}...`))
    } catch (error) {
     console.log(error)   
    }
}

start()