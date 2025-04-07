import express from 'express';

const router = express.Router();

router.delete('/delete_pin', (req, res) => {
  const { pinId } = req.body;

  console.log(`Received request to delete pin with ID: ${pinId}`);

  res.status(200).json({
    message: `Pin with ID ${pinId} deleted successfully`,
  });
});

export default router;