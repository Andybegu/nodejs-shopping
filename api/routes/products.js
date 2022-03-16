const express=require("express");
const  mongoose  = require("mongoose");
const Product = require("../module/product");
const multer=require("multer");
const upload=multer({dest:"uploads/"})

const route=express.Router();

route.get("/",(req,res,next)=>{
    Product.find()
    .select("name price _id")
    .exec()
    .then(doc=>{
        const response={
            count:doc.length,
            products:doc.map(docs=>{
             return{
                 name:docs.name,
                 price:docs.price,
                 _id:docs._id,
                 request:{
                     type:"get",
                     url:"http://localhost:3000/products/"+docs._id
                 }
             }
            })
        }
        res.status(200).json(response);
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })
});
route.post("/",upload.single('productImage'),(req,res,next)=>{
    console.log(req.file);
    const product= new Product({
        _id:new mongoose.Types.ObjectId(),
        name:req.body.name,
        price:req.body.price
    });
product
.save()
.then(result=>{
    res.status(201).json({
        createProduct:{ 
            name:result.name,
            price:result.price,
            _id:result._id,
            request:{
                type:"GET",
                url:"http://localhost:3000/products/"+result._id
            }}
    })
   
})
.catch(err=>{
    console.log(err);
    res.status(500).json({
        error:err
     })
})
    
});
route.get("/:productId",(req,res,next)=>{
    const id=req.params.productId;
    Product.findById(id)
    .select("name price _id")
    .exec()
    .then(doc=>{
     if(doc){
  res.status(200).json({
      products:doc,
      request:{
          type:"get",
          url:"http://localhost:3000/products/"+doc._id
      }
  });
     }
  else
  { res.status(404).json({
    message:"not found"
})}   
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
});
route.patch("/:productId",(req,res,next)=>{
    const id=req.params.productId
    const updateOps={};
    for(const ops of req.body){
        updateOps[ops.propName]=ops.value;
    }
    Product.updateOne({_id:id},{$set:updateOps})
    .exec()
    .then(doc=>{
        res.status(200).json({
            message:"product updated",
            request:{
                type:"GET",
                url:"http://localhost:3000/products/"+doc._id
            }
        })
    })
    .catch(err=>{
        res.status(500).json({error:err});
    })
})
route.delete("/:productId",(req,res,next)=>{
    const id=req.params.productId
    Product.remove({_id:id})
    .exec()
    .then(doc=>{
        res.status(200).json({
            message:"product deleted",
            request:{
          type:"POST",
          url:"http://localhost:3000/products/",
          body:{name:'String',price:"Number"}
      }
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })
});

module.exports=route;