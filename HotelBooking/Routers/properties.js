const router = require("express").Router();
const { model } = require("mongoose");
const multer = require("multer");
const Properties = require("../models/Property")
const cloudinary = require("../happer/cloudinary")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images")
    }, filename(req, file, cb) {
        // cb(null, "image2.jpeg"); 
        // cb(null, req.body.name); 
        cb(null, file.originalname)
    },
});

const upload = multer({ storage: storage })


// CREATE A POST
router.post("/create", upload.single("image"), async (req, res) => {
    try {
        const {
            title,
            location,
            desc } = req.body
      
        const result = await cloudinary.uploader.upload(req.file.path)
        if (!result) return res.status(400).json('Image not uploaded')
        const newProperties = await Properties.create({ 
            title, 
            location,
            desc,
            image: result.secure_url,
        })
        return res.status(200).json({
            success: true,
            data: newProperties,
            message:"data saved successfull"
        })
    } catch (error) {
        return res.status(500).json({
            status:false,
            message:"Fail", 
            error:error.message})
    }
   
});

router.get("/all", async (req, res) => {
    try {
        const properties = await Properties.find();
        return res.status(200).json({
            success: true,
            data: properties,
            message:"data rended successfull"
        })
    } catch (err) {
        return res.status(401).json({
            message:"Fail to get properties",
            status: "401",
            err:err.message
    })
}
});

router.get("/:id", async (req, res) => {
    try {
        const property = await Properties.findById(req.params.id);
        return res.status(200).json({
            success: true,
            data: property,
            message:"data rended successfull"
        });
    } catch (err) {
        return res.status(500).json({
            message:"Fail to get property",
            status: "500",
            err:err.message
        })
    }
});




module.exports = router;