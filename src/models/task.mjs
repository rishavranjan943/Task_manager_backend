import {mongoose} from 'mongoose'

const taskSchema=new mongoose.Schema({
    Description : {
        type : String,
        required : true,
        trim : true,
        default : 'Learn something donot waste time'
    },
    Complete : {
        type : Boolean,
        default :false,
        trim : true
    },
    owner : {
         type : mongoose.Schema.Types.ObjectId,
         required : true,
         ref : 'User'
    }

},{
    timestamps : true
})



const Task=mongoose.model('Task',taskSchema)


export default Task