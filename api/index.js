const express = require("express");
const Link = require("../models/link");
const router = express.Router();

router.get("/:urlId", async function (req, res) 
{
	try 
	{
		const { urlId } = req.params;
		const link = await Link.findOne({ urlId });
		if (!link) 
		{
			res.render("404.hbs", { title: "404 Not Found" });
			return;
		}
		res.redirect(link.originalUrl);
		link.clicks++;
		link.save();
	}
	catch (err) 
	{
		res.status(500).json({ status: "error", message: err.message });
	}
});

module.exports = router;
