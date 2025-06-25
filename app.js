const express=require('express');
const app=express();
const mongooes=require('mongoose');
const Listing=require("./models/listing.js");
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const path=require('path');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const wrapAsync=require('./utils/wrapasync.js');
const {listingSchema}=require('./public/js/schema.js');

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({ extended:true }));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,'/public')));


// /////////////////////////////////////////   function for stablish the connection with the mongoose database
async function main(params) {
    await mongooes.connect(MONGO_URL);
}
//                                       calling the main() function 
main().then(()=>{
    console.log("conneced to the Mongoose database");
}).catch((err)=>{
    console.log(err);
});

// ///////////////////////////////////////////// server code
app.get('/',(req,res)=>{
    res.redirect("/listings");
});


// this is owr index router 

app.get('/listings',wrapAsync(async(req,res)=>{
    let alllistings;
    await Listing.find({}).then((res)=>
        {
            alllistings = res;
        });
        // console.log(alllistings);
    res.render("listings/index.ejs",{data:alllistings});
}));

//         new router

app.get("/listings/new",wrapAsync(async(req,res)=>{
    res.render("listings/new.ejs");
}));


//     this is for show route 

app.get("/listings/:id",wrapAsync(async(req,res)=>{
    const id=req.params.id;
    let data;
    await Listing.findById(id).then((result)=>{
        data=result;
    });
//    console.log(data); 
   res.render("listings/show.ejs",{data});
}));

//create router

app.post("/listings",wrapAsync(async(req,res,next)=>{
    let listing=req.body.listing;
    let result=listingSchema.validate(req.body);
    // console.log(result);
    if(result.error){
        next(result.error);
    }
    const newlisting=new Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listings");
}));

// edit router

app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    const id=req.params.id;
    let data;
    await Listing.findById(id).then((result)=>{
        data=result;
    })
    res.render("listings/edit.ejs",{data});
}));

app.put("/listings/:id",wrapAsync(async(req,res,next)=>{
    let {id}=req.params;
    let result=listingSchema.validate(req.body);
    // console.log(result);
    if(result.error){
        next(result.error);
    }
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/listings");
}));

// delete router

app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

// app.get("/test",async (req,res)=>{
//     let semples=new Listing({
//         title:"my new",
//         description:"by the new",
//         price:1200,
//         location:"india",
//         country:"india"
//     });
//     await semples.save();
//     console.log("saved successfully");
//     res.send("sucessfully saved");
// });

// ///////////////////////////////      handling the error 

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500, message="Something Went Wrong"}=err;
    res.status(statusCode).render('listings/error.ejs',{err});
});
app.listen(3000,()=>{
    console.log("server is listening on port 3000");
});
