const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
//signup route
router.post('/sign-up', async (req, res)=>{
    console.log("signup route called");
    try{
        const {username, email, password} = req.body;
        if(!username || !email || !password){
            res.status(400).json({message: "All fields are required"});
        }
        if(username.length < 5){
             res.status(400).json({message: "Username should be atleast 5 characters long."});
        }
        if(password.length < 5){
             res.status(400).json({message: "Password should be atleast 5 characters long."});
        }

            

        //check if already exists...
        console.log("checking if user already exists..");
        const existingEmail = await User.findOne({email: email});
        const existingUsername = await User.findOne({username: username});
        if(existingEmail || existingUsername){
             res.status(400).json({message: "Username or Email already exists.."});
        }

        
        //after all the checks are performed, Hash the password..
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        //Now let's create new user because all the data is ready..

        const newUser = new User({username, email, password: hashedPass});
        await newUser.save();
         res.status(200).json({message: "Account Created"});
    }catch(error){
        res.status(500).json("hello, error in signup function", {error});
        console.log("errir in creating user", error);
    }
    res.send("signup route called");



});

// signin route
router.post('/sign-in', async (req, res)=>{
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({message: "All fields are required"});
        }
        const existingUser = await User.findOne({email: email});
        if(!existingUser){
            return res.status(400).json({message: "User does not exist"});
        }

        //check pass
        const isMatch = await bcrypt.compare(password, existingUser.password);

        if(!isMatch){
            return res.status(400).json({message: "Invalid Credentials"});
        }

        //generate jwt if credentials are correct
        const token = jwt.sign({id:existingUser._id, email: existingUser.email},
            process.env.JWT_SECRET, 
            {expiresIn: "30d"}
        );

        res.cookie("podmastUserToken", token, {
            httpOnly: true,
            maxAge: 30*24*60*60*1000, //30days
            secure: process.env.NODE_ENV === "production",
            sameSite:"None",
        });

        return res.status(200).json({
            id: existingUser._id,
            username: existingUser.username,
            email: email,
            message: "Sign-in Success"
        });

    }catch(error){
        res.status(400).json({ error });
    }

});
module.exports = router;
