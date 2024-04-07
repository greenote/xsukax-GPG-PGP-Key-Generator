const cloudinary = require("cloudinary").v2;
const {CloudinaryStorage} = require("multer-storage-cloudinary");
const multer = require("multer");
require('dotenv').config()

cloudinary.config({
    cloud_name: process.env.C_CLOUD_NAME,
    api_key: process.env.C_API_KEY,
    api_secret: process.env.C_API_SECRET,
});

const storage = (folder) => {
    return new CloudinaryStorage({
        cloudinary,
        params: {folder},
    })
};

const upload = (folder) => multer({storage: storage(folder)})

const DPFOLDER = "DISPLAY-PICTURES"

// const storage = new CloudinaryStorage({
//     cloudinary,
//     params: {folder},
// });

// const upload = multer({storage});

module.exports = {upload, cloudinary, DPFOLDER}