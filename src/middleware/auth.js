const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {STATUS_CODE} = require("../utils/constants");

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
        res.status(STATUS_CODE.notAllowed).send(e)
    }
}

module.exports = auth;