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

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', index.home);
app.get('/ingredients', index.arrangeIngredient);
app.get('/kitchen', index.getKitchen);
app.get('/order', index.getOrder);

app.post('/addIngredient', index.createIngredient);
app.post('/editIngredient', index.editIngredient);
app.post('/moveIngredient', index.moveIngredient);
app.post('/moveBackInIngredient', index.moveBackInIngredient);
app.post('/submitOrder',index.submitOrder);
app.post('/kitchenOrders', index.submitKitchen);

var mongoURI = process.env.MONGOURI || "mongodb://localhost/test";
mongoose.connect(mongoURI);

var PORT = process.env.PORT || 3006;

app.listen(PORT, function() {
  console.log("Application running on port:", PORT);
});