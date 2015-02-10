// Requires mongoose
var mongoose = require('mongoose');

// Creates new Schema out of mongoose
var orderSchema = mongoose.Schema({
	ingredients : [{type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient'}]
});

// Definition of the model in the models file
var Order = mongoose.model('Order', orderSchema);

// Export the model
module.exports = Order;