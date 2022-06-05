const mongoose = require('mongoose'); 
const studentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    Name: String,
    Batch: String,
})

module.exports = mongoose.model('Student', studentSchema);