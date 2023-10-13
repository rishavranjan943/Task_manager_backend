import express from 'express'
import User from '../models/user.mjs'
import auth from '../middleware/auth.mjs'
import Task from '../models/task.mjs'
import multer from 'multer'
import  sharp from 'sharp'
import { sendWelcomeEmail, sendCancelationEmail } from '../emails/account.mjs';

const router=new express.Router()

router.post('/users',async (req,res)=>{
    const user=new User(req.body)
    try{
        await user.save()
        sendWelcomeEmail(user.email,user.name)
        const token=await user.generateAuthToken()
        res.status(201).send({user,token})
    } catch(e){
        res.status(400).send(e)
    }
    // user.save().then(()=>{
    //     res.status(201).send(user)
    // }).catch((e)=>{
    //     res.status(400).send(e)
    // })
})



router.post('/users/login',async (req,res)=>{
    try {
        const user=await User.findByCredentials(req.body.email,req.body.password)
        const token =await user.generateAuthToken()
        res.send({user ,token})
        // res.send({user : user.getPublicProfile(),token})
    } catch (e) {
        res.status(400).send()
    }
})



router.post('/users/logout',auth,async (req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch(e) {
        res.status(500).send()
    }
})



router.post('/users/logoutAll', auth , async (req,res) => {
   try {
      req.user.tokens=[]  
      await req.user.save()
      res.send()
   } catch(e) {
    res.status(500).send() 
   }
})




router.get('/users/me',auth,async (req,res)=>{
    res.send(req.user)
    // try{
    //     const user=await User.find({})
    //     res.status(201).send(user)
    // } catch(e){
    //    res.status(400).send(e)
    // }
    // User.find({}).then((users)=>{
    //     res.send(users)
    // }).catch((e)=>{
    //    res.status(500).send()
    // })
})

// router.get('/users/:id',async (req,res)=>{
//     const _id=req.params.id
//     try{
//         const user=await User.findById(_id)
//         if(!user){
//             return res.status(404).send()
//         }
//         res.status(201).send(user)
//     } catch(e) {
//         res.status(401).send(e)
//     }
//     // User.findById(_id).then((users)=>{
//     //     if(!users){
//     //         return res.status(404).send()
//     //     }
//     //     res.send(users) 
//     // }).catch((e)=>{
//     //     res.status(500).send()
//     // })
// })



router.patch('/users/me',auth,async (req,res)=>{


    const allowedUpdates = ['name','email','password','age']
    const updates=Object.keys(req.body)
    const isValid=updates.every((update)=>{
        return allowedUpdates.includes(update)
    })

    if(!isValid){
        return res.status(404).send()
    }
    try{
        // const user=await User.findById(req.params.id)
        updates.forEach((update)=>{
            req.user[update]=req.body[update]
        })
        
        await req.user.save()
        // const user = await User.findByIdAndUpdate(req.params.id , req.body , {new : true,runValidator : true})

        // if(!user){
        //     return res.status(404).send()
        // }
        res.send(req.user)
    } catch(e) {
        res.status(400).send(e)
    }
})



router.delete('/users/me',auth,async (req,res)=>{
    try {
        // const user=await User.findByIdAndDelete(req.user._id)
        // // if(!user){
        // //     return res.status(404).send()
        // // }
        await Task.deleteMany({ owner: req.user._id })
        // await req.user.remove()
        await User.findByIdAndDelete(req.user._id)
        sendCancelationEmail(req.user.email,req.user.name)
        res.send(req.user)
    } catch(e) {
        res.status(500).send()
    }
})




const upload = multer ({
    limits : {
        fileSize :1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload images'))
        }
        return cb(undefined,true)
    }
})

router.post('/users/me/avatar',auth,upload.single('avatar'),async (req,res) => {
    const buffer= await sharp(req.file.buffer).png().resize({width : 250,height : 250}).toBuffer()
    req.user.avatar=buffer
    await req.user.save()
    res.send()
},(error,req,res,next) => {
    res.status(400).send({error : error.message})
})


router.delete('/users/me/avatar',auth,async (req,res) => {
    req.user.avatar=undefined
    await req.user.save()
    res.send()
})


router.get('/users/:id/avatar',async(req,res)=> {
    try {
        const user=await User.findById(req.params.id)

        if(!user || !user.avatar) {
            throw new Error()
        } 
        res.set('Content-type','image/png')
        res.send(user.avatar) 
    } catch(e) {
        res.status(404).send()
    }
})

export default router