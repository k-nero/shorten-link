const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const linkSchema = new Schema(
    {
        originalUrl: {
            type: String,
            required: true,
        },
        shortUrl: {
            type: String,
            required: true,
        },
        urlId: {
            type: String,
            required: true,
        },
        clicks: {
            type: Number,
            default: 0,
            required: true,
        },
        description: {
            type: String,
            default: '',
            required: false,
        }
    },
    {
        timestamps: true,
    });

const Link = mongoose.model('Link', linkSchema);
module.exports = Link;
