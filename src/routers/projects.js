const express = require('express');
const Project = require('../models/project');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const { STATUS_CODE, ERROR} = require("../utils/constants");
const log = require('../utils/log');

const router = new express.Router();
const path = '/projects';

/**
 * Gets all the projects.
 * @const projects - contains all the projects
 */

router.get(path, auth, async (req,res)=>{
        const projects = await Project.find({})
        try {
            res.status(STATUS_CODE.ok).send(projects)
        } catch (e) {
            await log(e)
            res.status(STATUS_CODE.notFound).send(e)
        }
})

/**
 * Gets all the projects related to user.
 * @const projects - contains all the projects related to user
 */

router.get(`${path}/:userID`, auth, async (req,res)=>{
        const projects = await Project.find({usersInvolved: {$elemMatch:{id:req.params.userID}}})
        try {
            res.status(STATUS_CODE.ok).send(projects)
        } catch (e) {
            await log(e)
            res.status(STATUS_CODE.notFound).send(e)
        }
})

/**
 * Creates a new project.
 * @const project - creates a new project
 */

router.post(path, async (req,res)=>{
        const project = new Project(req.body);
        try {
            await project.save()
            res.status(STATUS_CODE.created).send(project)
        } catch (e) {
            await log(e)
            res.status(STATUS_CODE.badRequest).send(e)
        }
})

/**
 * Modifies a project.
 * @const project - gets the project from db and modifies it
 */

router.patch(`${path}/:id`, async (req,res)=>{
        const project = await Project.findByIdAndUpdate(req.params.id, req.body,{new:true, runValidators:true})
        try {
            project ?
                res.status(STATUS_CODE.ok).send(project) :
                res.status(STATUS_CODE.badRequest).send(ERROR.notFound)
        } catch (e) {
            await log(e)
            res.status(STATUS_CODE.badRequest).send(e);
        }
})

/**
 * Deletes a project and tasks related to it.
 * @const project - finds the project and removes it
 * @const tasks - finds all the task related
 */

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
                await log(e)
                res.status(STATUS_CODE.badRequest).send(ERROR.notFound)
            }
        } catch (e){
            await log(e)
            res.status(STATUS_CODE.badRequest).send(e)
        }
})

module.exports = router;