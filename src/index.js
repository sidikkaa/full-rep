import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import { userModel } from "./schema/user.js";
import session from "express-session";

dotenv.config();

mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => {
    console.log(e);
    console.log("Error connection to db");
  });

const app = express();
//Express Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

//Session based auth
app.use(session({
    secret:"secret",
    resave:false,
    saveUninitialized:false,
    store:mongoose.createConnection({
      client:mongoose.connection.getClient(),
      collectionName:"sessions",
      stringify:true
    })
}))
app.use(passport.session())

//Passport Middleware
passport.use(userModel.createStrategy());
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());


//Routes
app.post("/signup" ,async (req, res) => {
  const { username, password } = req.body;
  const newUser = new userModel({username})
  userModel.register(
    newUser,
    password,
    (err,acc)=>{
        if (err) {
            console.log(err);
            res.sendStatus(500)
        }else{
            passport.authenticate("local")(req,res,()=>{
                res.sendStatus(200)
            })
        }
    }
   );
});

app.post("/login", async (req, res) => {
  const {username,password}=req.body
  if(!username||!password)
  {
    res.status(400).send("missing");
  }
  
}); 

app.post("signout", async (req, res) => {});

app.get("/check", (req, res) => {
    if (req.isAuthenticated()) {
        res.sendStatus(200)
    }else{
        res.sendStatus(400)
    }
});

app.listen(3000, () => {
  console.log("Running on port 3000");
}); 