const router = require("express").Router();
const { model } = require("mongoose");

const admin = require("firebase-admin")
const credentials = require("../hotelbooking-690d5-firebase-adminsdk-ams3v-095b6aa79a.json");
const { async } = require("@firebase/util");

admin.initializeApp({
    credential: admin.credential.cert(credentials)
})

router.post('/signup',async (req,res)=>{
    const user= {
        email:req.body.email,
        password:req.body.password
    }
    try { 
    const newUser = await admin.auth().createUser({
        email:user.email,
        password:user.password,
        emailVerified: false,
        disabled: false
    });
    return res.status(200).json(newUser)
} catch (error) {
        return res.status(500).json({
            error:error.message,
            message:"Fail"
        })
}
})

module.exports = router;