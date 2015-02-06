var mongoose = require('mongoose');

var orderSchema = mongoose.Schema({
	ingredients : [{type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient'}]
});

var Order = mongoose.model('Order', orderSchema);

module.exports = Order;