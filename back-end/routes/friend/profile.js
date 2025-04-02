import express from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
      cb(null, `${Date.now()}-${file.originalname}`);
    }


});

const upload = multer({ storage: storage });

router.post('/', upload.single('avatar'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file' });
  
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ fileUrl });
  });
  
  export default router;