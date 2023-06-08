const express = require('express');
const body_parser = require('body-parser');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
require('../passport-setup')


exports.login = async(req, res, next) => {
    try {
        const {uemail,upass} = req.body;
        console.log("-----------",uemail);
        console.log("-----------",upass);

        const user = await User.findOne({uemail:uemail});
        console.log("---------------",user);
        if (!user){
            // throw new Error('User dont exist')
            console.log('User dont exist')
        }else{
            const isMatch = bcrypt.compareSync(upass, user.upass);
            if(isMatch === false) {
                // throw new Error('Password Invalid')
                console.log('Password Invalid')
            }
            let tokenData = {uemail:user.uemail};
            const token = await UserService.generateToken(tokenData,"secretKey",'1h')
    
            res.status(200).json({status:true,token:token})
        }

    }catch (error) {
        throw error
        next(error);
    }
}