import mongoose from "mongoose";

const heroSchema = new mongoose.Schema({
 image1:{
    type:String
 },
 image2:{
    type:String
 },
 image3:{
    type:String
 }


})

export default mongoose.models.Hero || mongoose.model("Hero", heroSchema);
