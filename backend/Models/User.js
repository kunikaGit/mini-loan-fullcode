const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please provide email!'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide password!'],
    },
    role:{
        type:String,
        required: [true, 'Please provide role!'],
    }
    
});

module.exports = mongoose.model('User', UserSchema);
