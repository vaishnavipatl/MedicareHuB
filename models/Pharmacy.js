import mongoose from "mongoose";

const pharmacySchema = new mongoose.Schema({
    name : String ,
    email:{
        type:String ,
        uniqur:true
    },
    contact:String,
    password:String,
    medicalLicenseNumber:String,
})

const Pharmacy= mongoose.model('Pharmacy' ,pharmacySchema)
export default Pharmacy