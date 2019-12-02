const mongoose = require('mongoose');

const ThreeDModelSchema = new mongoose.Schema({
  userId: String,
  nameOfModel: String,
  data: String
});

mongoose.model('ThreeDModel', ThreeDModelSchema);
