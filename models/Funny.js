var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var FunnySchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  link: {
    type: String,
    required: true,
    unique: true
  },
  thumbnail: {
    type: String,
    required: true,
    unique: true
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

var Funny = mongoose.model("Funny", FunnySchema);

module.exports = Funny;