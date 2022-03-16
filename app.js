const express=require("express");
const morgan=require("morgan");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");

const app=express();

const routeProduct=require("./api/routes/products");
const order=require("./api/routes/orders");
const user=require("./api/routes/users");

mongoose.connect("mongodb://localhost:27017/andu")

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({
    extended:false
}));
app.use(bodyParser.json());
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Header","*");

    if(req.method==="OPTION"){
        res.header("Access-Control-Allow-Methods","PUT,GET,POST,PATCH,DELETE");
        return res.status(200).json({});
    }
next();
})

app.use('/products',routeProduct);
app.use("/order",order);
app.use("/user",user);

app.use((req,res,next)=>{
    const error=new Error("not found");
   error.status=404;
   next(error);
});
app.use((error,req,res,next)=>{
    res.status(error.status || 500)
    res.json({
        error:{
            message:error.message
        }
    })
})

module.exports=app;