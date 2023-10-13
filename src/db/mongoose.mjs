import {mongoose} from 'mongoose'

mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser : true,
    // useCreateIndex : true
})

// const User=mongoose.model('User',{
//     name : {
//         type : String,
//         required : true,
//         trim : true,
//     },
//     email : {
//         type : String,
//         required : true,
//         trim : true,
//         lowercase : true,
//         validate :{
//             validator(value){
//             if(!validator.isEmail(value)){
//                 throw new Error("Email is invalid")
//             }
//         }
//     }
//     },
//     password : {
//         type : String,
//         required : true,
//         minlength : 7,
//         trim  : true,
//         validate : {
//             validator(value){
//                 if(value.toLowerCase().includes('password')){
//                     throw new Error('Password cannot contain "password"')
//                 }
//             } 
//         }
//     },
//     age : {
//         type : Number,
//         default : 0,
//         validate : {
//         validator(value){
//             if(value<0){
//                 throw new Error("Age cannot be negative")
//             }
//         }

//     }
//     }
// })

// const me=new User({
//     name : '     Mine      ',
//     email : 'udrkwdj@vsjkvvjk.hdsh',
//     password : '     re32 ',
//     age : -17
// })
// // to save to database 
// me.save().then((me)=>{
//     console.log(me)
// }).catch((error)=>{
//     console.log("Error : ",error.message)
// })


// const me2=new User({
//     name : '     Tine     ',
//     email : 'udrkwdj@vsjkvvjk.com',
//     password : 'bhecpassword',
//     age : 17
// })
// // to save to database 
// me2.save().then((me)=>{
//     console.log(me)
// }).catch((error)=>{
//     console.log("Error : ",error.message)
// })


// const me3=new User({
//     name : '     Tine     ',
//     email : 'udrkwdj@vsjkvvjk.com',
//     password : 'bhecdfjewe',
//     age : 17
// })
// // to save to database 
// me3.save().then((me)=>{
//     console.log(me)
// }).catch((error)=>{
//     console.log("Error : ",error.message)
// })

// const Task=mongoose.model('Task',{
//     Description : {
//         type : String,
//         required : true,
//         trim : true,
//         default : 'Learn something donot waste time'
//     },
//     Complete : {
//         type : Boolean,
//         default :false,
//         trim : true
//     }
// })

// const my=new Task({
//     Description : 'Learn mongoose',
//     Complete : true
// })

// my.save().then((me)=>{
//     console.log(me)
// }).catch((error)=>{
//     console.log("Error : ",error.message)
// })

// const my2=new Task({
//     Complete : true
// })

// my2.save().then((me)=>{
//     console.log(me)
// }).catch((error)=>{
//     console.log("Error : ",error.message)
// })