const express = require("express");
const {auth} = require("../middleware/auth")
const { PostModel } = require("../model/postModel");

const postRouter = express.Router();
postRouter.use(auth);
postRouter.post("/add", async(req, res) => {
    const payload = req.body
  try {
    const note = new PostModel(payload);
    await note.save();
    res.status(200).json({ msg: "Post has been created" });
  } catch (error) {
    res.status(400).json({ msg: "Internal Server Error" });
  }
});

postRouter.get("/",async(req,res)=>{
    const {userID} = req.body;
    const {device,page}= req.query;

    try {
        let query={};
        query.userID=userID;
        if(device){
            query.device=device
        }

        let skip =0;
        if(page && page===1){
            skip=0
        }else if(page && page>1){
            skip=page*3
        }

        const post = await PostModel.find(query).skip(skip).limit(3);
        const total = await PostModel.countDocument({userID});
        res.status(200).json({post,total})
    } catch (error) {
        res.status(500).json({"msg":"Internal Server error"});
    }

})


postRouter.patch("/update/:id",async(req,res)=>{
    const {id} = req.params;

    try {
        if(id){
            let post = await PostModel.findByIdAndUpdate({_id:id,userID:req.body.userID},req.body);
            // await post.save();
            res.status(200).json({"msg":"Post has been Updated"},post);
        }else{
            res.status(400).json({"msg":"Something went wrong , try again!!"})
        }
    } catch (error) {
        res.status(500).json({"msg":'Internal Server Error'})
    }
})

postRouter.delete("/delete/:id",async(req,res)=>{
    const {id} = req.params;

    try {
        if(id){
            let post = await PostModel.findByIdAndDelete({_id:id,userID:req.body.userID});
         
            res.status(200).json({"msg":"Post has been Deleted!!"},post);
        }else{
            res.status(400).json({"msg":"Something went wrong , try again!!"})
        }
    } catch (error) {
        res.status(500).json({"msg":'Internal Server Error'})
    }

    
})



module.exports = { postRouter };
