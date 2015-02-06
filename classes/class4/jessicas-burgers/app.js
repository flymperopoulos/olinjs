// REQUIRES the following modules through npm
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');
var mongoose = require('mongoose');

var index = require('./routes/index');

var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Configuring the app - middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routing - GET
app.get('/', index.home);
app.get('/ingredients', index.arrangeIngredient);
app.get('/kitchen', index.getKitchen);
app.get('/order', index.getOrder);

// Methods - POST
app.post('/addIngredient', index.createIngredient);
app.post('/editIngredient', index.editIngredient);
app.post('/moveIngredient', index.moveIngredient);
app.post('/moveBackInIngredient', index.moveBackInIngredient);
app.post('/submitOrder',index.submitOrder);
app.post('/kitchenOrders', index.submitKitchen);

// Connect to Mongoose
var mongoURI = process.env.MONGOURI || "mongodb://localhost/test";
mongoose.connect(mongoURI);

// Definition of local port or process.env variable
var PORT = process.env.PORT || 3006;

app.listen(PORT, function() {
  console.log("Application running on port:", PORT);
});