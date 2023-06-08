const mongoose = require('mongoose');

const majorSchema = new mongoose.Schema({
    faculty: String, //เก็บข้อมูลประเภททุนทั้งหมด
    branch: Array,
})

module.exports = mongoose.model('Major', majorSchema)

module.exports.savemajor = function(model,data) {
    model.save(data)
}