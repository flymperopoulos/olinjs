var mongoose = require('mongoose');

var orderSchema = mongoose.Schema({
	ingredientsInOrder : [String],
	customer : String
});

var Order = mongoose.model('Order', orderSchema);

module.exports = Order;