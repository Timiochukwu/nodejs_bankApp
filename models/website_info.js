const mongoose = require('mongoose');

const WebsiteInfoSchema = new mongoose.Schema({
    input_name: String,
    input_email: String,
    input_email_from: String,
    input_email_smtp_host: String,
    input_email_smtp_secure_type: String,
    input_email_smtp_port: Number,
    input_email_password: String,
    input_phone_number: String,
    input_phone_number_1: String,
    input_address: String,
    input_facebook: String,
    input_instagram: String,
    input_linkedin: String,
    input_twitter: String,
    text_description: String,
    image_1: String,
    favicon: String,
});
const WebsiteInfo = mongoose.model('website_infos', WebsiteInfoSchema);
module.exports = WebsiteInfo;
