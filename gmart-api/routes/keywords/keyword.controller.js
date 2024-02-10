var Keywords = require('./keyword.model');

exports.getKeywords = async function (req, res) {
    const keywords = [
        'Women',
        'Men',
        'Winter',
        'Spring',
        'Summer',
        'Autumn',
        'Hoodie',
        'T-Shirt',
        'Made in KG',
        'VIP',
    ];
    return res.status(200).send({ success: true, keywords: keywords })
}
