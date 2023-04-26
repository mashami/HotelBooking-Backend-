const express = require("express");
const app = express();

const mongoose = require("mongoose");
const properties = require("./Routers/properties");
const auth = require("./Routers/authentacation")
const multer = require("multer")
// const router = require("express").Router();
// const passport = require('passport');
// const swaggerDocumention = require("./happer/documentations")
const { MONGO_URI } = process.env;
const cors = require('cors');
// const realState = require("./routes/realState");

const bodyParser = require("body-parser");

const dotenv = require("dotenv");
dotenv.config();

require('dotenv').config()

app.use(express.json());
app.use("/images", express.static("./images"))

app.use(cors({
    origin: '*',
    optionsSuccessStatus: 200
}));

mongoose.set('strictQuery', true);
// console,log()
console.log("Waiting for connection....");
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        //listening to server
      
        app.listen(process.env.API_PORT, () => {
            
            console.log("Connected to MangoDB $ Server Its listening on port", process.env.API_PORT)



        })
    }).catch(error => console.log("Check Network or "+error.message));
//middleware
app.use(express.json())



app.use((req, res, next) => {
    console.log(req.path, req.method)
    next();
})
// router.get("/",(req,res)=>{
//      res.render("pages/index")
// })
// router.get("/google",passport.Authenticator('google',{scope:['profile','email']}))
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use("/api/authentication",auth);
app.use("/api/property", properties);


// swaggerDocumention(app);