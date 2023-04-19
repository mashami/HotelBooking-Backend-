const mongoose = require("mongoose")

const propertySchema = new mongoose.Schema({
    image:{
        type:String,
        required: true,
        
    },
    title:{
        type:String,
        required:true,
        // unique: true
    },
     location: {
          type: String,
            default: ''
    },
    desc: {
        type: String,
        required: true,
    },
    
}, { timestamps: true });

module.exports = mongoose.model ("Properties", propertySchema);