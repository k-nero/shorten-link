const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt-nodejs");
const userSchema = new Schema(
	{
		username: {
			type: String,
			required: true
		},
		password: {
			type: String,
			required: true
		},
		email: {
			type: String,
			required: true
		},
		role: {
			type: String,
			default: "user"
		},
		links: [
			{
				type: Schema.Types.ObjectId,
				ref: "Link"
			}
		]
	},
	{
		timestamps: true
	});

userSchema.methods.encryptPassword = function (password) {
	return bcrypt.hash(password, bcrypt.genSaltSync(10), null);
};

userSchema.methods.validPassword = function (password) {
	return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
