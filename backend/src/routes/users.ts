import express, {Request,Response} from 'express'
import userModel from '../models/user'
import jwt from 'jsonwebtoken'
import {check, validationResult} from 'express-validator'
import verifyToken from '../middleware/auth';

const userRouter=express.Router();

//get logged in user
userRouter.get("/me",verifyToken,async(req:Request,res:Response)=>{
    const  userId=req.userId;

    try{
        const user=await userModel.findById(userId).select("-password")//not include password field

        if(!user){
            res.status(400).json({message:"User Not Found"})
        }

        res.json(user);
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"Something went wrong!"})
    }
})


//api/users/register
userRouter.post("/register",[
    check("firstName","First Name is required").isString(),
    check("lastName","Last Name is requires").isString(),
    check("email","Email is required").isEmail(),
    check("password","password with 8 or more characters required").isLength({min:8})
],async (req:Request,res:Response)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({message:errors.array()})
    }
    try{
        let user=await userModel.findOne({email:req.body.email});

        if(user){
            return res.status(400).json({message:"User already exists!"})
        }

        user=new userModel(req.body)
        await user.save();
        //create token
        const token =jwt.sign(
            {userId:user.id},
            process.env.JWT_SECRET_KEY as string,
            {expiresIn:"1d"});

        res.cookie("auth_token",token,{
            httpOnly:true,
            secure: process.env.NODE_ENV==="production",
            maxAge:86400000,
        })    

        return res.status(200).send({message:"User Registered Ok"});
    }
    catch(error){
        console.log(error);
        res.status(500).send({message:"Something went wrong!"})
    }
})

export default userRouter;