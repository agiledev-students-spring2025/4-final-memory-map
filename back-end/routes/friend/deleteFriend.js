import express from 'express';

const router = express.Router();

router.delete('/delete_friend', (req, res) => {
  const { userId } = req.body;

  console.log(`Received request to delete friend with ID: ${userId}`);

  res.status(200).json({
    message: `Friend with ID ${userId} deleted successfully`,
  });
});

export default router;