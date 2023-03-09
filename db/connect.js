import mongoose from "mongoose";


const connectDB = (url, key)=>{
    mongoose.set('strictQuery', false);
    mongoose.connect(url.replace('<password>', key), {useNewUrlParser: true})
}

export default connectDB