const mongoose = require('mongoose');

const partnerSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add partner name"],
        unique: true
    },
    courses: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Please add course ID"],
            unique: true,
            ref: 'Course' 
        }],
        default: []
    },
    moneyPaid: {
        type: Number,
        required: [true, "Please add money paid"],
        default: 0
    },
    moneyToPay: {
        type: Number,
        required: [true, "Please add money to paid"],
        default: 0
    },
});

module.exports = mongoose.model("Partner", partnerSchema);