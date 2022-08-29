import multer from"multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public");
    },
    filename: function (req, file, cb) {
        let fileNameExtension = file.originalname.replace(/\s/g, "-").toLowerCase().split(".");
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, `${fileNameExtension[0]}-${uniqueSuffix}.${fileNameExtension[1]}`);
    },
});

const upload = multer({ storage });


export default upload;