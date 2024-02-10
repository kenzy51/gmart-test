var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Keyword = new Schema({
    value: String,
}, {
    timestamp: true,
});

module.exports = mongoose.model('Keyword', Keyword);
