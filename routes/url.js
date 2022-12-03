const express = require('express');
const router = express.Router();
const isUrl = require('../utils/validate.js');
const randomID = require('../utils/randomId.js');
const Link = require('../models/link.js');
const authenticate = require("../middleware/authenticate");
const User = require("../models/user");


router.post('/short',authenticate , async function(req, res, next)
{
    try
    {
        const originalUrl = req.body.originalUrl;
        const description = req.body.description;
        if(await Link.findOne({originalUrl: originalUrl}))
        {
            res.status(400).json({status: 'error', message: 'URL already exists'});
            return;
        }
        if(!isUrl(originalUrl))
        {
            res.status(401).json({status: 'error', message: 'Invalid URL'});
            return;
        }
        let urlId;
        do
        {
            urlId = randomID(8);
        }
        while(await Link.findOne({urlId: urlId}));
        const shortUrl = `${process.env.BASE_URL}/${urlId}`;
        let payload = {
            originalUrl: originalUrl,
            shortUrl: shortUrl,
            urlId: urlId,
            description: description,
        }
        let link = await Link.create(payload);
        if(req.user)
        {
           await User.findByIdAndUpdate(req.user._id, {$push: {links: link._id}}, {new: true});
        }
        res.status(200).json({status: 'success', data: link});
    }
    catch(err)
    {
        res.status(500).json({status: 'error', message: err.message});
    }
});

router.post('/custom-url', async function(req, res, next)
{
    try
    {
        const originalUrl = req.body.originalUrl;
        const urlId = req.body.urlId;
        const description = req.body.description;
        if(await Link
            .findOne({
                originalUrl: originalUrl,
                urlId: urlId
            }))
        {
            res.status(400).json({status: 'error', message: 'URL already exists'});
            return;
        }
        if(!isUrl(originalUrl))
        {
            res.status(401).json({status: 'error', message: 'Invalid URL'});
            return;
        }
        if
        (
            await Link
                .findOne({
                    urlId: urlId
                })
        )
        {
            res.status(401).json({status: 'error', message: 'Custom URL already exists'});
            return;
        }
        const shortUrl = `${process.env.BASE_URL}/${urlId}`;
        let payload = {
            originalUrl: originalUrl,
            shortUrl: shortUrl,
            urlId: urlId,
            description: description,
        };
        let link = await Link.create(payload);
        res.status(200).json({status: 'success', data: link});

    }
    catch(err)
    {
        res.status(500).json({status: 'error', message: err.message});
    }
});

module.exports = router;
