const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    id: Number,
    aname: String,
    apws: String,
})

module.exports = mongoose.model('Admin', AdminSchema)
