import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    name : String ,
    email:{
        type:String ,
        uniqur:true
    },
    contact:String,
    password:String,
    medicalLicenseNumber:String,
    specialty:String,
    qualification:String,
    clinicAddress: String,
    visitingAddress: String,
})

const Doctor= mongoose.model('Doctor' ,doctorSchema)
export default Doctor