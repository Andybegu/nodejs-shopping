const express=require("express");
const router=express.Router();
const mongoose=require("mongoose");
const bcrypt=require("bcrypt");

const User=require("../module/user")

router.post("/signup",(req,res,next)=>{
    User.find({email:req.body.email}).exec()
    .then(result=>{
        if(result.length>=1){
            res.status(409).json({
                message:"mail exist"
            })
        }
        else{
            bcrypt.hash(req.body.password,10,(err,hash)=>{
                if(err){
                    return res.status(500).json(
                        {
                            error:err
                        });
                }
                else{
                    const user=new User({
                        _id: new mongoose.Types.ObjectId(),
                        email:req.body.email,
                        password:hash
                    });
                     user.save()
                     .then(result=>{
                         console.log(result);
                         res.status(200).json({
                             message:"user created"
                         })
                     })
                     .catch(err=>{
                         console.log(err);  
                         res.status(500).json({
                             error:err
                         })
                     })
                }
            });
        }
    })
    
    });
    router.post("/login",(req,res,next)=>{
        User.find({email:req.body.email})
        .exec()
        .then(result=>{
            if(result.length<1){
                res.status(401).json({
                    message:"Auth failed"
                })

            }
            bcrypt.compare(req.body.password,result[0].password,(err,rp)=>{
                if(err){
                    return res.status(401).json({
                        message:"Auth failed"
                    })
                }
                if(result){
                    return res.status(200).json({
                        message:"Auth successful"
                    })
                }
            })
        })
        .catch(err=>{
            res.status(500).json({
                error:err
            })
        })
    })

    router.delete("/:userId",(req,res,next)=>{
        User.remove({_id:req.params.userId})
        .exec()
        .then(result=>{
            res.status(200).json({
                message:"user deleted"
            })
        })
        .catch(err=>{
            res.status(500).json({
                error:err
            })
        })
    })

module.exports=router;