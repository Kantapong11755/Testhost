const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    uemail:{
        type: String,
        unique:true
    },
    upass: String,
    ufname: String,
    ulname: String,
    ustype: Array,
    ufaculty: String,
    ubranch: String,
    uclass: String,
    ugpa: Number,
    utoeic: Number,
    uielts: Number,
    utoefl: Number,
    pinned: Array,
    phonenumber:String
}
);

module.exports = mongoose.model('User', UserSchema)

module.exports.saveUser = function(model,data) {
    model.save(data)
}