const router = require("express").Router();
const { model } = require("mongoose");

const auth = require("../config/firebase");
const admin = require("firebase-admin")
const { createUserWithEmailAndPassword,signInWithEmailAndPassword,sendPasswordResetEmail } = require("firebase/auth")


// admin.initializeApp({
// 	projectId: process.env.project_id,
// 	serviceAccountId: process.env.service_account,
// });

// console.log(config)
// admin.initializeApp({...config})
// ========================================= This works on localhost ================================
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
// ==================================  Sign up ====================================
// const serviceAccount = {
//     projectId: process.env.FIREBASE_PROJECT_ID,
//     privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
//     clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
// };

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
    
// });

// router.post('/signup', async (req, res) => {
//     const user = {
//         email: req.body.email,
//         password: req.body.password,
//     }
//     try {
//         const newUser = await admin.auth().createUser({
//             email: user.email,
//             password: user.password,
//             emailVerified: false,
//             disabled: false
//         });
//         return res.status(200).json(newUser)
//     } catch (error) {
//         return res.status(500).json({
//             error: error.message,
//             message: "Fail"
//         })
//     }
// })
// =================================================================================


// ======================================Other sign up ===============================


router.post('/signup', async (req, res) => {
    try {
        const {email,password} = req.body;
        const user = await createUserWithEmailAndPassword(auth,email,password);
        return res.status(201).json(user);
    } catch (error) {
        return res.status(500).json({status:"fail", message:error.message})
    }
});

// ============================================ log in ====================================
router.post("/login", async (req,res) =>{
    try {
        const { email,password } = req.body;
        const user = await signInWithEmailAndPassword(auth,email,password);
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({status:"fail", message:error.message})
    }
});

// =========================================================================================

router.post('/resetPassword', async (req, res) => {
    try {
      const { email } = req.body;
      await sendPasswordResetEmail(auth,email);
     return res.status(200).json({
        message: 'Password reset email sent successfully.'
      });
    } catch (error) {
      
      return res.status(500).json({
        error: error.message,
        message: 'Failed to send password reset email.'
      });
    }
    
  });
  



module.exports = router;