const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")
const multer = require("multer")
const path = require("path")
const cors = require("cors");
const { MongoClient } = require('mongodb');
const { type } = require("os");
app.use(express.json());
app.use(cors());

// Database coonection with MongoDB
async function main() {
    // we'll add code here soon
    const uri = "mongodb+srv://gajananchavhan180:Admin150@@cluster0.dtzcc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    const client = new MongoClient(uri);
 }

// API Creation

app.get("/",(req,res)=>{
    res.send("Express App is Running")
})

// Image storage engine

const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
    
})

const upload = multer({storage:storage})

//Creating Upload Endpoint for images
app.use('/images',express.static('upload/images'))

app.post("/upload",upload.single('product'),(req,res) =>{
    if (!req.file) {
        return res.status(400).json({ success: 0, message: "No file uploaded!" });
    }
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`,
    });
});

// Schema for creating Products

const Product = mongoose.model("Product",{
    id:{
        type:Number,
        required:true,
        
    },name:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    new_price:{
          type:Number,
          required:true
    },
    date:{
        type:Date,
        default:Date.now,
    },
    available:{
        type:Boolean,
        default:true,
    }
})

app.post('/addproduct',async(req,res) =>{
    const product = new Product({
        id:req.body.id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
    });
    console.log(product);
    await product.save();
    console.log("saved");
    res.json({
        sucess:true,
        name:req.body.name,
    })
})

app.listen(port,(error)=>{
    if(!error){
        console.log("Server Running on Port "+port);
    }
    else{
        console.log("Error: "+error);
    }
})

