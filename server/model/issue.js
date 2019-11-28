const mongoose = require( 'mongoose' )

const issues = new mongoose.Schema({
  status: {type: String, required: true},
  owner: String,
  created: {type: Date, default: Date.now},
  effort: {type: Number, min: 0, max: 100},
  completionDate: Date,
  title: String
})

mongoose.model('Issues', issues)