var path = require('path');
var Ingredient = require(path.join(__dirname,'../models/ingredientModel'));
var Order = require(path.join(__dirname,'../models/orderModel'));

var routes = {};

routes.home = function(req, res) {
	res.render('home');
}

routes.arrangeIngredient = function (req,res){
	Ingredient.find({},function(err,ingredientList){

		if (err){
			console.log('error took place');
		}

		var inStockIng = [];
		var outStockIng = [];
		ingredientList.forEach(function(ingredient){
			if (ingredient.inStock){
				inStockIng.push({data:ingredient});
			} else {
				outStockIng.push({data:ingredient});
			}
		});

		var InOutStock = {'inStock':inStockIng, 'outOfStock':outStockIng};
		res.render('ingredients', InOutStock);

	});
}

routes.createIngredient = function (req, res){

	var newIngr = req.body
	newIngr.inStock = true;
	var IngredientX = new Ingredient(newIngr);

	console.log(req.body.itemName);
	console.log(newIngr);

	Ingredient.count({itemName:newIngr.itemName},function (err,count){
		if (!count) {
			IngredientX.save(function (err) {
			  if (err) {
			    console.log("Problem saving bob", err);
			  } else {
				  	Ingredient.findOne(newIngr, function (err,data){
			  			  	if (err){
			  			  		console.log('An error occured here.');
			  			  	}
			  			  	else {
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

routes.editIngredient = function (req, res){
	console.log(req.body);
	var objectID = req.body.id;
	var updatedName = req.body.itemName;
	var updatedCost = req.body.cost;
	console.log(updatedName);

	Ingredient.update({'_id':objectID},{$set: {itemName : updatedName, cost : updatedCost}}, {upsert: true}, function (err){
		if (err){
			console.log('An error occured and name and price could not be updated.');
		} else {
			res.send();
		}
	})
}

routes.moveIngredient = function (req, res){
	var id = req.body.id;
	console.log('this is the id: ' + id);
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

	Ingredient.find({}, function(err, ingredientList) {
		if (err) {
			console.error("Is not able to find ingredients", err);
		};
		res.render('order', {'ingredients': ingredientList});
	});
}

routes.submitOrder = function (req, res){
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
	res.end();
}
	
module.exports = routes;