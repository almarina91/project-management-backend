const express = require('express');
const Project = require('../models/project');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const { STATUS_CODE, ERROR} = require("../utils/constants");

const router = new express.Router();
const path = '/projects';

// get all projects
router.get(path, auth, async (req,res)=>{
        const projects = await Project.find({})
        try {
            res.status(STATUS_CODE.ok).send(projects)
        } catch (e) {
            res.status(STATUS_CODE.notFound).send(e)
        }
})

// get all projects connected to user
router.get(`${path}/:userID`, auth, async (req,res)=>{
        const projects = await Project.find({usersInvolved: {$elemMatch:{id:req.params.userID}}})
        try {
            res.status(STATUS_CODE.ok).send(projects)
        } catch (e) {
            res.status(STATUS_CODE.notFound).send(e)
        }
})

// create a new project
router.post(path, async (req,res)=>{
        const project = new Project(req.body);
        try {
            await project.save()
            res.status(STATUS_CODE.created).send(project)
        } catch (e) {
            res.status(STATUS_CODE.badRequest).send(e)
        }
})

// modify a project - role has to be checked!!!!!!!
router.patch(`${path}/:id`, async (req,res)=>{
        const project = await Project.findByIdAndUpdate(req.params.id, req.body,{new:true, runValidators:true})
        try {
            project ?
                res.status(STATUS_CODE.ok).send(project) :
                res.status(STATUS_CODE.badRequest).send(ERROR.notFound)
        } catch (e) {
            res.status(STATUS_CODE.badRequest).send(e);
        }
})

// delete a project (and tasks related to it)
router.delete(`${path}/:id`, async (req,res)=>{
        const project = await Project.findByIdAndDelete(req.params.id)
        try {
            if (project) {
                const tasks = await Task.find({projectID: req.params.id})
                for (let task of tasks) {
                    await Task.findByIdAndDelete(task._id)
                }
                res.status(STATUS_CODE.ok).send(project)
            } else {
                res.status(STATUS_CODE.badRequest).send(ERROR.notFound)
            }
        } catch (e){
            res.status(STATUS_CODE.badRequest).send(e)
        }
})

module.exports = router;