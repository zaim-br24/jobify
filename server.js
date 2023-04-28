import dotenv from "dotenv";
dotenv.config()
import express  from 'express'
import 'express-async-errors'
// import cors from 'cors'

const app = express();
// DB and authentication
import connectDB from "./db/connect.js";

// Middleware
import notFoundMiddleware from './middleware/not-found.js'
import errorHandlerMiddleware from './middleware/error-handler.js'
import authRouter from "./Router/authRouter.js";
import jobsRouter from './Router/jobsRouter.js'

app.use(express.json())
// app.use(cors)

app.get('/', (req, res)=>{
    res.json( {msg: "Welcome!"})
})



//routes
app.use("/api/v1/auth", authRouter );
app.use("/api/v1/jobs", jobsRouter );

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