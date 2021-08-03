const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {STATUS_CODE} = require("../utils/constants");
const log = require('../utils/log');

/**
 * Authenticates the user.
 * @const token - gets a token provided in request header
 * @const decoded - checks the token provided
 * @const user - gets the user data
 */

const auth = async (req,res,next) =>{
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token,  process.env.JWT_SECRET);
        const user = await User.findOne({_id:decoded._id, 'tokens.token':token});

        if (!user) {
            throw new Error()
        }
        req.token= token;
        req.user = user;
        next()
    } catch(e) {
        await log(e)
        res.status(STATUS_CODE.notAllowed).send(e)
    }
}

module.exports = auth;