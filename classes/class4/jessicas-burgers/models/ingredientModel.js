var mongoose = require('mongoose');

var ingredientSchema = mongoose.Schema({
	itemName : String,
	cost : Number,
	inStock : Boolean
});

var Ingredient = mongoose.model('Ingredient', ingredientSchema);

module.exports = Ingredient;