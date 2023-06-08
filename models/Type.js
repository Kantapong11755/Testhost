const mongoose = require('mongoose');

const typeSchema = new mongoose.Schema({
    scholarship_type: Array  //เก็บข้อมูลประเภททุนทั้งหมด
})

module.exports = mongoose.model('Type', typeSchema)

module.exports.savetype = function(model,data) {
    model.save(data)
}