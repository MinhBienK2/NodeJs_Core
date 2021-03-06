const ApiError = require('../utils/ApiError')
const CatchAsync = require('../utils/CatchAsync')
const multer = require('multer')
const sharp = require('sharp')

const multerStores = multer.memoryStorage()

const multerFilters = (req,file,cb) => {
    if(file.mimetype.startsWith('image')) {
        cb(null,true)
    } else {
        cb(new ApiError('Not an image! Please upload only images.',400),false)
    }
}

const upload = multer({
    storage: multerStores,
    fileFilter: multerFilters
})

// const uploadPostImage = upload.fields([{
//     name : 'photo', maxCount: 1
// }])

const uploadPostImage = upload.single('photo')

const resizePostPhoto = CatchAsync(async(req,res,next) => {
    // console.log(req.file)
    if(!req.file) return next()
    req.body.photo = `posts-${req.params.categoryId}-${Date.now()}-photo.jpeg`
    await sharp(req.file.buffer)
        .resize(700,700)
        .toFormat('jpeg')
        .jpeg({quality : 90})
        // .toFile(`public/images/posts/${req.body.photo}`)
        .toFile(`src/public/images/posts/${req.body.photo}`)
    next()
})

module.exports = {
    uploadPostImage,
    resizePostPhoto
}