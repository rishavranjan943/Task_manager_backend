import express from 'express'
import './db/mongoose.mjs'
import User from './models/user.mjs'
import Task from './models/task.mjs'
import userRoute from './routers/user.mjs'
import taskRoute from './routers/task.mjs'
// import dotenv from 'dotenv';

// dotenv.config({ path: './config/dev.env' });

const app=express()

const port=process.env.PORT


// app.use((req,res,next)=>{
//     // console.log(req.method,req.path)
//     // next() 
//     if(req.method=='GET'){
//         res.send('GET request disabled')
//     } else {
//         next()
//     }
// })

// app.use((req,res,next)=>{
//     res.status(503).send("Site under maintainenece")
// })




app.use(express.json())
app.use(userRoute)
app.use(taskRoute)


app.listen(port,()=>{
    console.log("Server is up on port "+port)
}) 


