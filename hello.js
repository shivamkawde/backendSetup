var express = require('express');

const  check=require("./cook");
console.log(check.check());

const mongoose=require("mongoose")
var app = express();
const jwt=require("jsonwebtoken");
var cookieParser = require('cookie-parser');
app.use(cookieParser());
const JWT_KEY="exsnandnkeuuu";
app.use(express.json());
app.use(express.urlencoded());//for url encoded

const loginMiddelware=(req,res,next)=>{
    console.log(req.cookies.login);

    if(req.cookies.login)
    {
          let isVerifiy=jwt.verify(req.cookies.login,JWT_KEY)
          console.log(isVerifiy.payload.name);
          if(isVerifiy){
              req.url="/homesetup";
              req.body=isVerifiy.payload.name;
              next();
          }
          else{
              res.send("error")
          }
    }
    else{


        next()
        // res.json({
        //     mez:"cookies not here"
        // })
    }
    // next();
}
app.use(loginMiddelware);


let authRouter=express.Router()
let userDataRouter=express.Router();
app.use("/auth",authRouter);
app.use("/userData",userDataRouter);
authRouter.route("/")
.get(getUser);
authRouter.route("/signup")
.get(getUser)
.post(postUser)
userDataRouter.route("/")
.get(getUser)
userDataRouter.route("/allUser")
.get(getData)


app.get("/Alluser",(req,res)=>{
    res.sendFile('/public/Alluser.html',{root:__dirname})

})

app.get("/Login",(req,res)=>{
    res.sendFile('/public/Login.html',{root:__dirname})

})

app.get("/homesetup",(req,res)=>{
    res.sendFile('/public/homesetup.html',{root:__dirname})
   // res.send("hello"+"  "+req.body)
})


app.post("/login",async(req,res)=>{
  let  a= await userModel.findOne({ pw: `${req.body.pwd}` }).then((e)=>{
    let uid=e._id;
    let user={ 
        name:req.body.name,
        uid:e._id
    }
    let token=jwt.sign({payload:user},JWT_KEY);
    res.cookie("login",token);

    console.log(e);
     res.send(e);
    // res.json({
    //     mes:e
    // });
  });
         //console.log(a);
         

//  console.log(e);
      
//    res.json({
//        mes:"doner"
//    })


      //res.send(e)
//  }).catch((err)=>{
//      res.send(err)

//  })

  
 
})   
function postUser(req,res){
    createUser(req.body);
console.log(req.body);
//   res.send(res)

   
}

function getUser(req,res){
    console.log("got all user")
  res.sendFile('/public/index.html',{root:__dirname})
}
app.listen(8000,()=>{
    console.log("listing")
})

const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    pw:{
        type:String,
        required:true
    }
})

const userModel=mongoose.model('userModel',userSchema);//it for making model 

async function createUser(user){
    // let user={
    //     name:"shivam",
    //     pw:123444
    // }
    let data=await userModel.create(user);
    console.log(data);
}


async function getData(req,res){
    let arr=[]
   let a= await userModel.find({}).then((resv)=>{
      // arr.push(resv);
       res.send(resv);
   });

}







mongoose.connect("mongodb+srv://admin:zHBnyjZPQ1XY4NYi@cluster0.my7qt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority").then((dc)=>{
    console.log("connected");
}).catch(()=>{
    console.log("not");
})