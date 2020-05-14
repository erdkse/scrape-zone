const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema(
  {
    keywords: { type: String },
    results: {
      type: Array,
    },
    proceedOn: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

ResultSchema.methods = {
  toJSON() {
    return {
      ID: this._id,
      results: this.results,
      proceedOn: this.proceedOn,
    };
  },
};

module.exports = mongoose.model('Result', ResultSchema);
