const mongoose = require('mongoose');

const LoanSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, 'Please provide id!'],
        unique: true,
    },
    amount: {
        type: Number,
        required: [true, 'Please provide Amount!'],
    },
    term: {
        type: Number,
        required: [true, 'Please provide term!'],
    },
    date: {
        type: Number,
        required: [true, 'Please provide Date!'],
    },
    intervalDays: {
        type: Number,
        required: [true, 'Please provide interval days!'],
    },
    scheduledRepayments: [{
        date: {
            type: Date,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ['PENDING', 'PAID'],
            default: 'PENDING',
        },
    }],
    status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'PAID'],
        default: 'PENDING',
    },
    amountReturned: {
        type: Number,
        default: 0,
    },
    instalmentsPaid: {
        type: Number,
        default: 0,
    },
});

module.exports = mongoose.model('LoanRequest', LoanSchema);
