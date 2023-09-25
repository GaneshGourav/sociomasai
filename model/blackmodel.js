const mongoose = require("mongoose");
const blackschema = mongoose.Schema(
  {
    token: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

const BlackModel = mongoose.model("blacklist", blackschema);

module.exports = { BlackModel };
