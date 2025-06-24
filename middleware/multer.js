import multer from "multer";

const Storage = multer.diskStorage(
    {
        destination:function (req,file,cb){
           return cb(null,"./uploads")
        },
        filename:function (req,file,cb){
        return cb(null, `${ new Date().toLocaleDateString().split("/").join("-") }-${file.originalname}`);

        }
    }
);

export const upload = multer({storage:Storage});



