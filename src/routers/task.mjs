import express from "express"
import Task from "../models/task.mjs"
import auth from "../middleware/auth.mjs"

const router=new express.Router()


router.post('/tasks', auth , async (req,res)=>{
    // const task=new Task(req.body)
    const task=new Task({
        ...req.body,
        owner : req.user._id
     })
    try{
        await task.save()
        res.status(201).send(task)
    } catch(e) {
        res.status(401).send(e)
    }
    // task.save().then(()=>{
    //     res.status(201).send(task)
    // }).catch((e)=>{
    //     res.status(400).send(e)
    // })
})


router.get('/tasks',auth,async (req,res)=>{
    const match={}
    const sort={}
    if(req.query.Complete){
        match.Complete = req.query.Complete === 'true'
    }

    if(req.query.sortBy){
        const parts=req.query.sortBy.split(':')
        sort[parts[0]] =  parts[1] === 'desc' ? -1 : 1
    }
    try{
        // const task=await Task.find({owner : req.user._id})
        // res.status(201).send(task)
        await req.user.populate({
            path : 'tasks',
            match,
            // match: {
                // Complete : false
            // }
            options : {
                limit : parseInt(req.query.limit),
                skip :parseInt(req.query.skip),
                sort
                // sort : {
                //     createdAt : -1
                        // Complete : false
                // }
            }
        })
        res.status(201).send(req.user.tasks)
    } catch(e){
        res.status(400).send()
    }
    // Task.find({}).then((tasks)=>{
    //     res.send(tasks)
    // }).catch((e)=>{
    //     res.status(500).send()
    // })
})

router.get('/tasks/:id',auth,async (req,res)=>{
    const _id=req.params.id
    try{
        // const task= await Task.findById(_id)
        const task=await Task.findOne({_id,owner : req.user._id})
        if(!task){
            res.status(404) .send()
        }
        res.status(201).send(task)
    } catch(e) {
        res.status(401).send(e)
    }
    // Task.findById(_id).then((tasks)=>{
    //     if(!tasks){
    //         return res.status(404).send()
    //     }
    //     res.send(tasks)
    // }).catch((e)=>{
    //     res.status(400).send()
    // })
})






router.patch('/tasks/:id', auth ,async (req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates=['Description','Complete']
    const isValid=updates.every((update)=>{
        return allowedUpdates.includes(update)
    })
    if(!isValid){
        return res.status(400).send({error : 'Invalid updates'})
    }
    try{
        // const task=await Task.findById(req.params.id)
        const task=await Task.findOne({_id : req.params.id ,owner : req.user._id})
        if(!task){
            return res.status(404).send()
        }
        updates.forEach((update)=>{
            task[update]=req.body[update]
        })
        await task.save()
        // const task=await Task.findByIdAndUpdate(req.params.id,req.body,{new :true,runValidator :true})
        res.send(task)
    } catch(e) {
        res.status(400).send(e.message)
    }
})





router.delete('/tasks/:id',auth,async (req,res)=>{
    try{
        // const task=await Task.findByIdAndDelete(req.params.id)
        const task=await Task.findOneAndDelete({_id : req.params.id , owner : req.user._id })
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        return res.status(401).send(e.message)
    }
})


export default router