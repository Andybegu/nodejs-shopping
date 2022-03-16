const express=require("express");
const Order = require("../module/order");
const mongoose=require("mongoose");
const Product=require("../module/product");

const route=express.Router();

route.get("/",(req,res,next)=>{
    Order.find()
    .exec()
    .then(result=>{
        res.status(200).json({
            count:result.length,
            order:result.map(doc=>{
                return{
                    _id:doc._id,
                    product:doc.product,
                    quantity:doc.quantity,
                    request:{
                        type:"GET",
                        url:"http://localhost:3000/order/"+doc._id
                    }
                }
            })
        })

    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })
});
route.post("/",(req,res,next)=>{
    Product.findById(req.body.productId)
    .then(product=>{
        if(!product){
           return res.status(404).json({
                message:"product not found"
            })
        }
        const order=new Order({
            _id:mongoose.Types.ObjectId(),
            product:req.body.productId,
            quantity:req.body.quantity
        });
       return order.save()
        
    }).then(result=>{
        res.status(201).json({
            createOrder:{ 
                product:result.product,
                quantity:result.quantity,
                _id:result._id,
                request:{
                    type:"GET",
                    url:"http://localhost:3000/order/"+result._id
                }}
        })
       }).catch(err=>{
           res.status(500).json({
               error:err
           });
       });
    
  
});
route.get("/:orderId",(req,res,next)=>{
    Order.findById(req.params.orderId)
    .exec()
    .then(order=>{
        if(!order){
            return res.status(404).json({
                 message:"product not found"
             })
         }
        res.status(200).json({
            order:order,
            request:{
                type:"GET",
                url:"http://localhost:3000/order"
            }
        })

    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })
});
route.delete("/:orderId",(req,res,next)=>{
   Order.remove({_id:req.params.orderId})
   .exec()
   .then(order=>{
    if(!order){
        return res.status(404).json({
             message:"product not found"
         })
     }
    res.status(200).json({
        message:"order delete",
        request:{
            type:"POST",
            url:"http://localhost:3000/order",
            body:{productId:'ID',quantity:"Number"}
        }
    })

})
   .catch(err=>{
    res.status(500).json({
        error:err
    })
})
})

module.exports=route;