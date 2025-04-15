import mongoose from 'mongoose';

const pinSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    location: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: {
            type: [Number]
        }
    },
    imageUrl: {
        type: String,
        default: ''
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    tags: [{
        type: String,
        trim: true
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

pinSchema.index({ location: '2dsphere' });

pinSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Pin = mongoose.model('Pin', pinSchema);

export default Pin; 