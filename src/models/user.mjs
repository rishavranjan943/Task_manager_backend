import mongoose from 'mongoose'
import validator from 'validator';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Task from './task.mjs'

const userSchema=new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true,
    },
    email : {
        type : String,
        unique : true,
        required : true,
        trim : true,
        lowercase : true,
        validate :{
            validator(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is invalid")
            }
        }
    }
    },
    password : {
        type : String,
        required : true,
        minlength : 7,
        trim  : true,
        validate : {
            validator(value){
                if(value.toLowerCase().includes('password')){
                    throw new Error('Password cannot contain "password"')
                }
            } 
        }
    },
    age : {
        type : Number,
        default : 0,
        validate : {
        validator(value){
            if(value<0){
                throw new Error("Age cannot be negative")
            }
        }

    }
    },
    tokens : [{
        token : {
            type : String,
            required : true
        }
    }],
    avatar : {
        type : Buffer
    }
},{
    timestamps : true
})


userSchema.methods.generateAuthToken = async function () {
    const user=this
    const token=jwt.sign({_id : user._id.toString()},process.env.JWT_SECRET)
    user.tokens=user.tokens.concat({token : token})
    await user.save()
    return token
}


userSchema.statics.findByCredentials = async (email,password) => {
    const user=await User.findOne({email : email})

    if(!user){
        throw new Error('Unable to login')
    }
    const isMatch=await bcrypt.compare(password,user.password)

    if(!isMatch){
        throw new Error('Unable to login')
    }
    return user
}


userSchema.pre('save',async function (next){
    const user=this

    console.log('Just before')
    if (user.isModified('password')){
        user.password=await bcrypt.hash(user.password,8)
    }


    next()
})



// userSchema.methods.getPublicProfile = function() {
//     const user =this
//     const userObject=user.toObject()

//     delete userObject.password 
//     delete userObject.tokens 

//     return userObject
// }


userSchema.virtual('tasks',{
    ref : 'Task',
    localField : '_id',
    foreignField : 'owner'
})


userSchema.methods.toJSON = function() {
    const user =this
    const userObject=user.toObject()

    delete userObject.password 
    delete userObject.tokens 
    delete userObject.avatar

    return userObject
}


const User=mongoose.model('User', userSchema)

export default User