import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    password: {
        type: String
    },
    profilePicture: {
        type: String,
        default: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' //default profile pic lol
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    friendRequests: {
        sent: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        received: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;