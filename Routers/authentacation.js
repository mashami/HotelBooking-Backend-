const router = require("express").Router();
const { model } = require("mongoose");

const admin = require("firebase-admin")

// admin.initializeApp({
// 	projectId: process.env.project_id,
// 	serviceAccountId: process.env.service_account,
// });

// console.log(config)
// admin.initializeApp({...config})
// ========================================= This works ================================
// const credentials = require("../firebaseConfig.json");
// admin.initializeApp({
//     credential: admin.credential.cert(credentials)
// })

// router.post('/signup',async (req,res)=>{
//     const user= {
//         email:req.body.email,
//         password:req.body.password,
//     }
//     try {
//     const newUser = await admin.auth().createUser({
//         email:user.email,
//         password:user.password,
//         emailVerified: false,
//         disabled: false
//     });
//     return res.status(200).json(newUser)
// } catch (error) {
//         return res.status(500).json({
//             error:error.message,
//             message:"Fail"
//         })
// }
// })
// =====================================================================================

const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  };
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // Other Firebase Admin SDK configuration options here
  });

router.post('/signup',async (req,res)=>{
    const user= {
        email:req.body.email,
        password:req.body.password,
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