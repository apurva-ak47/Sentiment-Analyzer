const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    name: { type: String, default: '' },
  },
  { timestamps: true }
)

userSchema.methods.toSafeJSON = function () {
  return { id: this._id.toString(), email: this.email, name: this.name, createdAt: this.createdAt }
}

module.exports = mongoose.model('User', userSchema)
