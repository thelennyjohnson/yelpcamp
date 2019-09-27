var mongoose = require("mongoose");


var commentSchema = new mongoose.Schema({
  text: String,
  author: { 
    // associated comment to user
    id: {
      type: mongoose.Schema.Types.ObjectId,
      // ref refers to the model you're calling on this
      ref:"User"
    },
    username: String
  }
});

module.exports = mongoose.model("Comment", commentSchema);