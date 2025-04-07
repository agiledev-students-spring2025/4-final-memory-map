import express from "express";
import multer from "multer";

const router = express.Router();
let localUsers = [];
router.post('/create_user', async (req, res) => {
    const { user_id, 
        username, 
        first_name, 
        last_name, 
        email, 
        gender, 
        birthdate, 
        password 
    } = req.body;
    
    if (!user_id || !username || !first_name || !last_name){
        return res.status(400).send("Error");
    }

    // Uncomment later
    /*
    const exist = await Userdb.findOne({
        $or: [
                { username },
                { email },
                { first_name, last_name }
            ]
    });
    if(exist){
        return res.status(409)
    }
    */

    const currNewUser = { user_id, 
        username, 
        first_name, 
        last_name, 
        email, 
        gender, 
        birthdate, 
        password, 
        profile_picture,
        allFriendsId: [], 
        allPinsId: [], 
        createdAt: new Date() 
    };

    localUsers.push(currNewUser);

    return res.status(201).json({message:"User created",user:{user_id:currNewUser.user_id,
        username: currNewUser.username,
        email: currNewUser.email,
        profile_picture: currNewUser.profile_picture}});
    
}
);

export default router;