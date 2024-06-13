import express, {Request,Response} from 'express'
import multer from 'multer'
import cloudinary from 'cloudinary'
import hotelModel, { HotelType } from '../models/hotel';
import verifyToken from '../middleware/auth';
import { body } from 'express-validator';

const hotelRouter=express.Router();

const storage=multer.memoryStorage();
const upload=multer({
    storage:storage,
    limits:{
        fileSize:5*1024*1024 //5mb
    }
})

//api/my-hotels/
hotelRouter.post("/",verifyToken,[
    body("name").notEmpty().withMessage("Name is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("type").notEmpty().withMessage("Hotel type is required"),
    body("pricePerNight").notEmpty().isNumeric().withMessage("Price per night is required and must be a number"),
    body("facilities").notEmpty().isArray().withMessage("Facilities are required"),
],upload.array("imageFiles",6), async(req:Request,res:Response)=>{
    try{
        const imageFiles=req.files as Express.Multer.File[]; 
        const newHotel:HotelType=req.body;

        //1. upload images to cloudinary
        const uploadPromises=imageFiles.map(async(image)=>{
            const b64=Buffer.from(image.buffer).toString("base64")
            let dataURI="data:"+image.mimetype+";base64,"+b64;
            const res=await cloudinary.v2.uploader.upload(dataURI);
            return res.url;
        });

        const imageUrls=await Promise.all(uploadPromises);

        //2. if upload successfull, add the URLs to the new hotel
        newHotel.imageUrls=imageUrls;
        newHotel.lastUpdated=new Date();
        newHotel.userId=req.userId;
        
        //3. save new hotel in database
        const hotel =new hotelModel(newHotel);
        await hotel.save();

        //4. return 201 status 
        res.status(201).send(hotel);
    }
    catch(e){
        console.log("Error creating hotel: ",e);
        res.status(500).json({message:"Something went wrong"})
    }
})

export default hotelRouter;