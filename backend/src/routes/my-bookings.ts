import express, {Request,Response} from 'express';
import verifyToken from '../middleware/auth';
import hotelModel from '../models/hotel';
import { HotelType } from '../shared/types';

const bookingRouter=express.Router();

//api/my-bookings
bookingRouter.get("/",verifyToken,async(req:Request,res:Response)=>{
    try{
        const hotels=await hotelModel.find({
            bookings:{$elemMatch:{userId:req.userId}}
        });

        const results=hotels.map((hotel)=>{
            const userBookings=hotel.bookings.filter((booking)=>booking.userId===req.userId);

            const hotelWithUserBookings:HotelType={
                ...hotel.toObject(),
                bookings:userBookings,
            }

            return hotelWithUserBookings;
        });

        res.status(200).send(results);


    }
    catch(error){
        console.log("error");
        res.status(500).json({message:"Unable to fetch bookings"});
    }
})

export default bookingRouter;