const express = require('express');
const router = new express.Router();

const auth = require('../middleware/auth');

const Task = require('../models/task');
const { STATUS_CODE, ERROR } = require("../utils/constants");
const path = '/tasks';

// get all tasks
router.get(path, auth, async (req,res)=> {
        const tasks = await Task.find({})
        try {
            tasks ?
                res.status(STATUS_CODE.ok).send(tasks) :
                res.status(STATUS_CODE.notFound).send(ERROR.notFound)
        } catch(e){
            res.status(STATUS_CODE.badRequest).send(e)
        }
})

// get all tasks for a specific project
router.get(`${path}/:id`, auth, async (req,res)=> {
        const tasks = await Task.find({projectID: req.params.id})
        try {
            tasks ?
                res.status(STATUS_CODE.ok).send(tasks) :
                res.status(STATUS_CODE.notFound).send(ERROR.notFound)
        } catch(e){
            res.status(STATUS_CODE.badRequest).send(e)
        }
})

//get a specific task
router.get(`${path}/spec/:id`, auth, async(req,res)=>{
    const task = await Task.find({_id:req.params.id})
    if (task.length !== 0){
            try {
                res.status(STATUS_CODE.ok).send(task)
            } catch (e) {
                res.status(STATUS_CODE.badRequest).send(e)
            }
    } else {
        res.status(STATUS_CODE.notFound).send(ERROR.notFound)
    }
})

//get all tasks of a user
router.get(`${path}/user/:id`, auth, async (req,res)=> {
        const tasks = await Task.find({assignee: req.params.id})
        try{
            tasks ?
                res.status(STATUS_CODE.ok).send(tasks) :
                res.status(STATUS_CODE.notFound).send(ERROR.notFound)
        } catch(e){
            res.status(STATUS_CODE.badRequest).send(e)
        }
})

// creating a new task
router.post(path, auth, async (req,res)=>{
    const task = new Task(req.body)
    try {
        await task.save()
        res.status(STATUS_CODE.created).send(task)
    } catch (e) {
        res.status(STATUS_CODE.badRequest).send(e)
    }
})

// modify a task
router.patch(`${path}/:id`, auth, async (req,res)=>{
    const task = await Task.find({_id:req.params.id})
    if (task.length !==0){
           const taskModified = await Task.findByIdAndUpdate(req.params.id, req.body,{new:true, runValidators:true})
           try {
              res.status(STATUS_CODE.ok).send(taskModified) ;
           } catch (e) {
               res.status(STATUS_CODE.badRequest).send(e)
           }
   } else {
        res.status(STATUS_CODE.notFound).send(ERROR.notFound)
   }

})

// delete a task
router.delete(`${path}/:id`, async(req,res)=>{
        const task = await Task.findByIdAndDelete(req.params.id)
        try {
            task ?
                res.status(STATUS_CODE.ok).send(task) :
                res.status(STATUS_CODE.notFound).send(ERROR.notFound)
        } catch(e) {
            res.status(STATUS_CODE.badRequest).send(e)
        }
})

module.exports = router;