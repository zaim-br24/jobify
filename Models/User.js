
import mongoose from 'mongoose';
import validator from 'validator';


const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'please provide a name'],
        minlength: 3,
        maxlength: 20,
        trim: true,
    },
    email:{
        type: String,
        required: [true, "please provide an email"],
        unique: true,
        validate:{
            validator: validator.isEmail,
            message: 'please provide a valid email'
        },
        trim: true
    },
    password:{
        type: String,
        required: [true, 'please provide a password'],
        minlength:8,
        maxlength:30,
    },
    lastName:{
        type: String,
        minlength: 3,
        maxlength: 20,
        trim: true,
        default: "last name"
    },
    location:{
        type: String,
        trim: true,
        default: "Fes"
        
    }
})

export default mongoose.model('User', UserSchema);