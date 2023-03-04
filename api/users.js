/* eslint-disable no-undef */
const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("jsonwebtoken");
const authenticate = require("../middleware/authenticate");
const Link = require("../models/link");
/* GET users listing. */
router.get("/", function (req, res)
{
	res.send("respond with a resource");
});

router.post("/login", async function (req, res)
{
	try
	{
		const payload = {
			username: req.body.username.trim(),
			password: req.body.password.trim()
		};
		const user = await User.findOne({ username: payload.username });
		const validPassword = bcrypt.compareSync(payload.password, user.password);
		if (!user || !validPassword)
		{
			res.status(401).json({ status: "error", message: "Invalid username or password" });
			return;
		}
		const token = jwt.sign({ user }, process.env.JWT_SECRET, { algorithm: "HS256", expiresIn: "1440h" }, {});
		res.status(200).json({ status: "success", data: token });
	}
	catch (err)
	{
		res.status(500).json({ status: "error", message: err.message });
	}
});

router.post("/register", async function (req, res)
{
	try
	{
		if (req.body.password.length < 8)
		{
			res.status(401).json({ status: "error", message: "Password must be at least 8 characters" });
			return;
		}
		const encryptedPassword = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null);
		const payload = {
			username: req.body.username,
			password: encryptedPassword,
			email: req.body.email,
			phone: req.body.phone
		};
		const isExist = await User.findOne({ username: payload.username });
		if (isExist)
		{
			res.status(401).json({ status: "error", message: "Username already exist" });
			return;
		}
		const user = await User.create(payload);
		const token = jwt.sign({ user }, process.env.JWT_SECRET, { algorithm: "HS256", expiresIn: "1440h" }, {});
		res.status(200).json({ status: "success", data: token });
	}
	catch (err)
	{
		res.status(500).json({ status: "error", message: err.message });
	}
});

router.get("/getLinks", authenticate, async function (req, res)
{
	try
	{
		const payload = {
			userId: req.user._id
		};
		const links = await User.findById(payload.userId).populate("links");
		res.status(200).json({ status: "success", data: links });
	}
	catch (err)
	{
		res.status(500).json({ status: "error", data: err.message });
	}
});

router.get("/getUserInfo", authenticate, async function (req, res)
{
	try
	{
		const payload = {
			userId: req.user._id
		};
		const user = await User.findById(payload.userId);
		res.status(200).json({ status: "success", data: user });
	}
	catch (err)
	{
		res.status(500).json({ status: "error", data: err.message });
	}
});

router.post("/updateLink", authenticate, async function (req, res)
{
	try
	{
		const urlId = req.body.urlId;
		const newOriginalUrl = req.body.originalUrl;
		const newDescription = req.body.description;
		const link = await Link.findOneAndUpdate({ urlId }, { originalUrl: newOriginalUrl, description: newDescription }, { new: true });
		res.status(200).json({ status: "success", data: link });
	}
	catch (err)
	{
		res.status(500).json({ status: "error", message: err.message });
	}
});

router.post("/deleteLink", authenticate, async function (req, res)
{
	try
	{
		const urlId = req.body.urlId;
		const userId = req.user._id;
		const link = await Link.findOneAndDelete({ urlId });
		const user = await User.findOne({ _id: userId });
		if (user)
		{
			if (user.links.includes(link._id))
			{
				user.links.pull(link._id);
				user.save();
			}
		}
		res.status(200).json({ status: "success", data: link });
	}
	catch (err)
	{
		res.status(500).json({ status: "error", message: err.message });
	}
});

module.exports = router;
