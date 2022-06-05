const express = require('express'); 
const router = express.Router(); 
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('../models/Users');  

router.post('/signup',(req,res,next)=>{

    Users.find({email:req.body.email})
   .exec()
   .then(users =>{                                        
       if(users.length){                                
           res.status(500).json({
               message: "Mail Already Exits!!!!"
           })
       }
       else {
           bcrypt.hash(req.body.password, 10,(err,hash)=>{                          
            if(err){
                res.status(500).json({
                    message: "Signup Error!!!!"
                })
            } 
            else{
               const information = {                                                 
                   _id : mongoose.Types.ObjectId(),
                   name : req.body.name,                 
                   email: req.body.email,
                   password : hash
               }
                       
                const user = new Users(information);                   
                user.save()
                .then(result=>res.status(200).json(result))
                .catch(err=>res.status(500).json(err))
            }  
           })
       }
   })
   .catch(err=>res.status(500).json(err))

}) 

 // signin

router.post('/signin',(req,res,next)=>{
 Users.findOne({email:req.body.email})                                        
 .exec()
 .then(users=>
  {
      if(!users)                                                          
      {
          res.status(500).json({
              message : "Authentication Failed"
          })
      }
      else{
          bcrypt.compare(req.body.password,users.password,(err,result)=>{                      
              if(err){ 
                  console.log(err);                                                          
                  res.status(500).json({
                      message: "Password Wrong!!!!!"
                  })
              }
              if(result)
              {
                 
                 const token = jwt.sign({id: users._id,name:users.name,email:users.email},`${process.env.JWT_KEY}`,{       
                                                                       
                     expiresIn : 3600
                 });
                 
                 res.status(200).json({
                     message : "Authentication Successfull!!!",
                     token : token
                 })
              }
              else {
                  res.status(500).json({
                      message : "Try Again!!"
                  })
              }
              
              
          })
      }
  })
  .catch(err=>res.status(500).json(err))
})

 
module.exports = router;