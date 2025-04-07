import express from 'express';
import multer from 'multer';

const router = express.Router();
let localUsers = [];

router.post('/create_user', (req, res) => {
    const { 
        user_id, 
        username, 
        first_name, 
        last_name, 
        email, 
        gender, 
        birthdate, 
        password 
    } = req.body;

    if (!user_id || !username || !first_name || !last_name) {
        return res.status(400).send("Error");
    }

    const newUser = {
        user_id,
        username,
        first_name,
        last_name,
        email,
        gender,
        birthdate,
        password,
        profile_picture: "https://robohash.org/suntautnisi.png?size=50x50&set=set1",
        allFriendsId: [],
        allPinsId: [],
        createdAt: new Date(),
    };

    localUsers.push(newUser);

    console.log('New User:', newUser);

    res.status(201).json({
        message: 'User created',
        user: {
            user_id: newUser.user_id,
            username: newUser.username,
            email: newUser.email,
            profile_picture: newUser.profile_picture,
        },
    });
});

export default router;
