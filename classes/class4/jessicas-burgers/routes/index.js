// Requires path modulo and the models Ingredient and Order
var path = require('path');
var Ingredient = require(path.join(__dirname,'../models/ingredientModel'));
var Order = require(path.join(__dirname,'../models/orderModel'));

// Initializes routes new object
var routes = {};

// Home method renders home.handlebars
routes.home = function(req, res) {
	res.render('home');
}

routes.arrangeIngredient = function (req,res){
	// query for all ingredients, seperate by state of in-Stock and out-Stock and render
	Ingredient.find({},function(err,ingredientList){

		if (err){
			console.log('error took place');
		}

		// Initiates empty arrays for in and out of Stock items
		var inStockIng = [];
		var outStockIng = [];
		// Goes through each one in the list
		ingredientList.forEach(function(ingredient){
			// If true, append data to in-Stock list of ingredients
			if (ingredient.inStock){
				inStockIng.push({data:ingredient});
			} else {
				outStockIng.push({data:ingredient});
			}
		});

		// renders ingredient
		var InOutStock = {'inStock':inStockIng, 'outOfStock':outStockIng};
		res.render('ingredients', InOutStock);

	});
}
// handles post to /addIngredient path
routes.createIngredient = function (req, res){

	var newIngr = req.body
	newIngr.inStock = true;
	// creates new instance of the model
	var IngredientX = new Ingredient(newIngr);

	console.log(req.body.itemName);
	console.log(newIngr);

	// queries all ingredients looking for itemName characteristic and making sure no duplicate entries exist
	Ingredient.count({itemName:newIngr.itemName},function (err,count){
		if (!count) {
			// save to the database
			IngredientX.save(function (err) {
			  if (err) {
			    console.log("Problem saving bob", err);
			  } else {
				  	Ingredient.findOne(newIngr, function (err,data){
			  			  	if (err){
			  			  		console.log('An error occured here.');
			  			  	}
			  			  	else {
			  			  		// renders partial
			  			  	  res.render('partials/newingredientform', {layout: false, data:data});
			  			  	} 
					})
			  }
			});
		} else {
			res.end();
		}
	})
}
// handles post to /editIngrement
routes.editIngredient = function (req, res){
	console.log(req.body);
	var objectID = req.body.id;
	var updatedName = req.body.itemName;
	var updatedCost = req.body.cost;
	console.log(updatedName);

	// updates old, with new name and cost of ingredient
	Ingredient.update({_id:objectID},{$set: {itemName : updatedName, cost : updatedCost}}, {upsert: true}, function (err){
		if (err){
			console.log('An error occured and name and price could not be updated.');
		} else {
			res.send();
		}
	})
}

routes.moveIngredient = function (req, res){
	// makes an ingredient out-of-stock
	var id = req.body.id;
	console.log('this is the id: ' + id);
	// updates and sets the property inStock to false to change state
	Ingredient.update({'_id':id}, {$set: {inStock:false}}, function (err, data){
		Ingredient.findOne({'_id':id},function	(err, data){
			if (err){
				res.send('There was an error.');
			} else {
				res.send(data);
			}
		})
	})
}

routes.moveBackInIngredient = function (req, res){
	// makes an ingredient in stock
	var id = req.body.id;
	console.log('this is the id: ' + id);
	Ingredient.update({'_id':id}, {$set: {inStock:true}}, function (err, data){
		Ingredient.findOne({'_id':id},function	(err, data){
			if (err){
				res.send('There was an error.');
			} else {
				res.send(data);
			}
		})
	})
}

routes.getOrder = function(req, res){
	// Create orders based on ingredient lists
	Ingredient.find({}, function(err, ingredientList) {
		if (err) {
			console.error("Is not able to find ingredients", err);
		};
		res.render('order', {'ingredients': ingredientList});
	});
}

routes.submitOrder = function (req, res){
	// declare the orders collections and save OrderX as db object
	var newOrder = req.body
	var ingredients = newOrder.ingredients.split(',');
	var OrderX = new Order({'ingredients':ingredients});

	console.log(OrderX);

	OrderX.save(function (err){
		if (err){
			console.log('Error taking place',err);
		} else {
			res.end();
		}
	})
}

routes.getKitchen = function(req, res){
	// Gets all data in Order Object and populates them with ingredients that compose the orders
	Order.find({})
		 .populate('ingredients')
		 .exec(function(err, orders) {
	    if (err) console.log(err);
	    else {
	        res.render('kitchen', {'orders':orders});
    }
	});
}

routes.submitKitchen = function(req, res){

	Order.find({'_id':req.body.idToDelete})
		 .remove(function(err) {
			if (err) console.log('error on deleting order');
		});
}
	
module.exports = routes;