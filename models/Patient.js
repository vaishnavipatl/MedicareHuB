import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
    name:String,
    email:{
        type:String ,
        uniqur:true
    },
    contact:String,
    password:String,
    address:String
})

const Patient= mongoose.model('Patient' ,patientSchema)
export default Patient