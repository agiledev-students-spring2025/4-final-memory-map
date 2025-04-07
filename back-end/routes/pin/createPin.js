import express from 'express';
import multer from 'multer';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

router.post('/create_pin', upload.single('image'), (req, res) => {
    const { pinName, pinDescription, locationLatitude, locationLongitude } = req.body;

    if (!req.file) {
        return res.status(500).json({ error: 'Image file is missing' });
    }
    
    const imageUrl = `/uploads/${req.file.filename}`;

    const newPinData = {
        pinName,
        pinDescription,
        locationLatitude,
        locationLongitude,
        imageUrl,
    };

    console.log('New Pin:', newPinData);

    res.status(200).json({ message: 'Pin created successfully', data: newPinData });
});

export default router;