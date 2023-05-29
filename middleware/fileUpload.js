const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/menuImages'),function(error,success){
            if(error)throw error
        })
    },
    filename:function(req,file,cb){
        let date= new Date();

        const name =date.toISOString().slice(0,10)+'-'+file.originalname;
         cb(null,name,function(error,success){
            if(error)throw error
         })
        
    }
});
const upload = multer({storage:storage})

module.exports=upload;