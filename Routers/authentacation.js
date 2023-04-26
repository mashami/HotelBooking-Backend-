const router = require("express").Router();
const { model } = require("mongoose");
const { firebaseConfig } = require("../config/firebase");
const auth = require("../config/firebase");
const admin = require("firebase-admin");
// const {db} = require("../config/firebase")
// const { getAuth, signInWithPopup, GoogleAuthProvider }= require("firebase/auth");
const { getAuth, signInWithPopup }= require("firebase/auth");

const {getStorage,ref,getDownloadURL,uploadBytesResumable } = require("firebase/storage")
const { child }=require("firebase/storage");

const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
const {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    sendEmailVerification,


} = require("firebase/auth")
// const credentials = require("../firebaseConfig.json");





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
        const { email, password } = req.body;
        const user = await createUserWithEmailAndPassword(auth, email, password);
        return res.status(201).json(user);
    } catch (error) {
        return res.status(500).json({ status: "fail", message: error.message })
    }
});
// ============================== Sign up by using firebase firestore =====================

router.post('/signupWithFirestore', async (req, res) => {
    try {
        const db = admin.firestore();
        const { email, password, age } = req.body;
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        if (!userCredential?.user?.uid) {
            throw new Error('Invalid user ID');
        }

        await db.collection('users').doc(userCredential.user.uid).set({
            age: age,
            email: email,
        });
        return res.status(201).json(userCredential.user);
    } catch (error) {
        return res.status(500).json({ status: 'fail', message: error.message });
    }
});


// ============================================ log in ====================================
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await signInWithEmailAndPassword(auth, email, password);
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ status: "fail", message: error.message })
    }
});

// =========================================================================================

router.post('/resetPassword', async (req, res) => {
    try {
        const { email } = req.body;
        await sendPasswordResetEmail(auth, email);
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

// ==============================================================================
// ================================== Get all users =================================



router.get("/getAll", async (req, res) => {
    try {


        const listUsersResult = await admin.auth().listUsers();
        const users = listUsersResult.users.map(userRecord => {
            const user = userRecord.toJSON();
            return {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                emailVerified: user.emailVerified,
                disabled: user.disabled
            };
        });
        return res.status(200).json(users);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: error.message,
            message: "Failed to get users."
        });
    }
});

// ============================================== get by uid =========================

router.get('/user/:uid', async (req, res) => {
    try {
        const { uid } = req.params;
        const userRecord = await admin.auth().getUser(uid);
        const userData = {
            uid: userRecord.uid,
            email: userRecord.email,
            displayName: userRecord.displayName,
            photoURL: userRecord.photoURL,
            phoneNumber: userRecord.phoneNumber,
            disabled: userRecord.disabled,
            metadata: userRecord.metadata,
            providerData: userRecord.providerData
        };
        return res.status(200).json(userData);
    } catch (error) {
        return res.status(500).json({ status: 'fail', message: error.message });
    }
});

// ==================================== Delete a user =================================

router.delete('/deleteUser/:uid', async (req, res) => {
    const uid = req.params.uid;
    try {
        await admin.auth().deleteUser(uid);
        return res.status(200).json({
            message: `A user with UID ${uid} has been deleted successfully`,
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message,
            message: 'Failed to delete user',
        });
    }
});

//   =========================== Update a user =================================
router.patch("/updateUser/:uid", async (req, res) => {


    const { email } = req.body;
    const uid = req.params.uid

    try {
        const userRecord = await admin.auth().updateUser(uid, { email });
        console.log(`Successfully updated user: ${userRecord.uid}`);
        return res.status(200).json(userRecord);
    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({ message: 'Failed to update user.' });
    }
});

// ================================ Sign up google acount =================================
 router.post('/signUpGoogleAccount', async (req, res) => {
    let provider;
    // const provider = new admin.auth.GoogleAuthProvider()
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        return res.status(200).json(user)
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        return res.status(200).json({
            error:error.message
        })
      });

 });




// router.post('/signUpGoogleAccount', async (req, res) => {
//     const { email, password } = req.body;
//     let uid;
//     try {
//         const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//         const user = userCredential.user;

//         console.log(user)
//         uid = user.uid
//         await user.sendEmailVerification();
//         await signInWithEmailAndPassword(auth, email, password);

//         return res.redirect('/');
//     } catch (error) {

//         console.log(error);
//         await admin.auth().deleteUser(uid);
//         console.log(error);
//         res.status(500).json({ message: 'Error signing up', error: error.message });
//     }
// });

// ===========================================================================================

// ============================================ Upload a picture ===========================
const multer = require("multer")
// const storage = getStorage()
// const upload= multer({ storage:multer.memoryStorage() })

// router.post("/upload",upload.single("filename"), async(req,res)=>{
//     try {
//         const dateTime =giveCurrentDateTime();
//         const storegeRef= ref(storage,`files/${req.file+ " "+ dateTime}`);

//         const metadata ={
//             contentType: req.file.mimetype,
//         }
//         const snapshot = await uploadBytesResumable(storegeRef, req.file.buffer,metadata)
//         // , req.file.buffer
//         const downloadURL = await getDownloadURL(snapshot.ref)

//         console.log("File uploaded successful")
//         return res.send({
//             message:'file uploaded successful to firebase storage',
//             name:req.file,
//             type: req.file.mimetype,
//             downloadURL: downloadURL,
//             status:'200'
//         }) 
        
//     } catch (error) {
//         return res.status(500).json({
//             error:error.message,
//             message:"Fail to upload a file"
//         })
//     }
// });
const giveCurrentDateTime = () =>{
    const today= new Date();
    const date = today.getFullYear() + '-'+ (today.getMonth()+1) + '-' + today.getDay();
    const time = today.getHours()+ ':' + today.getMinutes() + ':' + today.getSeconds();
    const dateTime = date + ' ' + time;
    return dateTime
}

const storage = getStorage();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { files: 5 },
});

router.post("/upload", upload.array("images", 5), async (req, res) => {
  try {
    const dateTime = giveCurrentDateTime();
    const storageRef = ref(storage, `files/`);
    const uploadedFiles = [];

    for (const file of req.files) {
      const fileRef = ref(storageRef, `${file.originalname}_${dateTime}`);
      const metadata = {
        contentType: file.mimetype,
      };
      const snapshot = await uploadBytesResumable(
        fileRef,
        file.buffer,
        metadata
      );
      const downloadURL = await getDownloadURL(snapshot.ref);

      console.log("File uploaded successfully");
      uploadedFiles.push({
        name: file.originalname,
        type: file.mimetype,
        downloadURL: downloadURL,
      });
    }

    return res.status(200).json({
      message: "Files uploaded successfully to Firebase storage",
      files: uploadedFiles,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      message: "Failed to upload files",
    });
  }
});

module.exports = router;