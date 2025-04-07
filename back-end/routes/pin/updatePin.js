import express from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

let localPins = [];

export const setLocalPins = (pins) => {
  localPins = pins;
};

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

router.put('/update_pin', upload.single('image'), (req, res) => {
  const { pinId, pinName, pinDescription, locationLatitude, locationLongitude } = req.body;

  if (!pinId) return res.status(400).json({ error: 'pinId is required.' });

  const index = localPins.findIndex(pin => pin.pinId === Number(pinId));
  if (index === -1) return res.status(404).json({ error: 'Pin not found.' });

  // 更新字段（如果提供）
  if (pinName) localPins[index].pinName = pinName;
  if (pinDescription) localPins[index].pinDescription = pinDescription;
  if (locationLatitude) localPins[index].locationLatitude = locationLatitude;
  if (locationLongitude) localPins[index].locationLongitude = locationLongitude;
  if (req.file) {
    localPins[index].imageUrl = `/uploads/${req.file.filename}`;
  }

  res.status(200).json({
    message: 'Pin updated successfully',
    pin: localPins[index]
  });
});

export default router;
