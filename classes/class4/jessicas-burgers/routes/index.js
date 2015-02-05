var Ingredient = require('../models/ingredientModel.js');
var Order = require('../models/orderModel.js');

var routes = {};

routes.home = function(req, res) {
	res.render('home');
}


routes.arrangeIngredient = function (req,res){

	console.log('mof');
	
	Ingredient.find({},function(err,ingredientList){

		if (err){
			console.log('error took place');
		}

		console.log('hello');

		var inStockIng = [];
		var outStockIng = [];
		ingredientList.forEach(function(ingredient){
			if (ingredient.inStock){
				inStockIng.push(ingredient);
			} else {
				outStockIng.push(ingredient);
			}
		});

		var InOutStock = {'inStock':inStockIng, 'outOfStock':outStockIng};
		res.render('ingredients', InOutStock);

	});
}

routes.createIngredient = function (req, res){
	var IngredientX = new Ingredient(req.body);
	Ingredient.find({itemName:IngredientX.name},function (err,docs){
		if (!docs.length) {
			IngredientX.save(function (err) {
			  if (err) {
			    console.log("Problem saving bob", err);
			  }
			});
		} else {
			res.end();
		}
	})
}

// routes.getKitchen = function (req,res){
var kitchenData = 
// }

// routes.getOrder = function (req,res){

// }

module.exports = routes;