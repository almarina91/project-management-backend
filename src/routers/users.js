const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const User = require('../models/user');
const {STATUS_CODE, ERROR} = require("../utils/constants");
const path = '/users';
const allowedUpdates = ['username', 'password', 'email', 'name', 'surname'];

// getting all users - check the role!!!!
router.get(path, auth, async (req,res)=>{
        const users = await User.find({})
        try {
            users ?
                res.status(STATUS_CODE.ok).send(users) :
                res.status(STATUS_CODE.notFound).send(ERROR.notFound)
        } catch(e) {
            res.status(STATUS_CODE.badRequest).send(e)
        }
})

//getting a specific user
router.get(`${path}/:id`, auth, async(req,res)=>{
        const user = await User.find({_id:req.params.id})
        try {
            user ?
                res.status(STATUS_CODE.ok).send(user) :
                res.status(STATUS_CODE.notFound).send(ERROR.notFound)
        } catch(e) {
            res.status(STATUS_CODE.badRequest).send(e)
        }
})

// creating a new user
router.post(path, async (req,res)=>{
    const user = new User(req.body)
    try {
        const token = await user.generateAuthToken()
        await user.save()
        res.status(STATUS_CODE.created).send({user,token})
    } catch(e) {
        res.status(STATUS_CODE.badRequest).send(e)
    }
})

// login a user
router.post(`${path}/login`, async(req,res)=>{
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({user, token})
    } catch(e){
        res.status(STATUS_CODE.badRequest).send(e)
    }
})

// logout a user
router.post(`${path}/logout`, auth, async (req,res)=>{
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch(e) {
        res.status(STATUS_CODE.badRequest).send(e);
    }
})

// logout a user from all sessions
router.post(`${path}/logoutAll`, auth, async (req,res)=>{
    try {
        req.user.tokens = [];
        await req.user.save()
        res.send()
    } catch(e) {
        res.status(STATUS_CODE.badRequest).send()
    }
})

// modify a user
router.patch(`${path}/:id`, auth, async (req,res)=>{
        const updates = Object.keys(req.body);
        const isValidOperation = updates.every(update => allowedUpdates.includes(update));
        if (!isValidOperation) {
            return res.status(STATUS_CODE.badRequest).send('error')
        }
        try {
            updates.forEach(update=>{
                req.user[update]=req.body[update]
            })
            await req.user.save()
            res.send(req.user)
        } catch (e) {
            res.status(STATUS_CODE.badRequest).send(e)
        }
})

// delete a user
router.delete(`${path}/:id`, auth, async(req,res)=>{
        const user = await User.findByIdAndDelete(req.params.id)
        try {
            user ?
                res.status(STATUS_CODE.ok).send(user) :
                res.status(STATUS_CODE.notFound).send(ERROR.notFound)
        } catch (e) {
            res.status(STATUS_CODE.badRequest).send(e)
        }
})

module.exports = router;