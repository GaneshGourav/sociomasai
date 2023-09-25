const jwt = require("jsonwebtoken");
const {BlackModel} = require("../model/blackmodel")
const auth = async(req,res,next)=>{
const token = req.headers.authorization.split(" ")[1];
const black = await BlackModel.findOne({token});

if(!black){
    jwt.verify(token,"sociomasai",async(err,decoded)=>{
        if(decoded){
            const userID = decoded.userID;
            const name = decoded.name;
            req.body= {...req.body,userID,name};
            next();
        }else{
            res.status(400).json({"msg":"Your Session is Expired, please Login"});
        }
    })
}else{
    res.status(400).json({"msg":"login first"})
}
}


module.exports={auth}