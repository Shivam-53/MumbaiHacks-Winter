const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
    query: { type: Number, required: true, unique: true },
    seq: { type: Number, default: 0 },
});
const counter = mongoose.model("Counter", counterSchema);
module.exports = counter;
