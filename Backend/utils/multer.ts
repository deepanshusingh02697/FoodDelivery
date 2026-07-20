import multer from 'multer'

const foodStorage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"./upload");
    },
    filename:(req,file,cb)=>{
        cb(null,`${Date.now()}-${file.originalname}`)
    }
}) 

export const foodImgUpload = multer({
  storage:foodStorage,
  limits: {
    fileSize: 10 * 1024 * 1024,//10mb
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp","image/avif"];
 
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPG, PNG, and WEBP images are allowed"));
    }
    cb(null, true);
  },
});

