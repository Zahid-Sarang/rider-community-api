import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/profile");
    },
    filename: function (req, file, cb) {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(
            file.originalname,
        )}`;
        cb(null, uniqueName);
    },
});

export const upload = multer({
    storage,
});
