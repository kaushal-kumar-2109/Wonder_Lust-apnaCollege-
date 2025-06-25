const mongoose=require('mongoose');
const Schema=mongoose.Schema;

let defaultlink="https://images.unsplash.com/photo-1509518408633-d42f618a2bdc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const ListingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String
    },
    image:{
        type:String,
        default:defaultlink,
        set:(v)=> v === "" ? defaultlink : v,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ]
});

const Listing=mongoose.model("Listing",ListingSchema);
module.exports=Listing;