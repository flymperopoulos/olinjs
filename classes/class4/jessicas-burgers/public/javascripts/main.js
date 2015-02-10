// Declaration of forms used 
var $newForm = $("#ajax-form-ingredients");      // add ingredient form
var $inStockFormDiv = $("#inStockIngredients");  // div that contains in-stock ingr.
var $outStockFormDiv = $("#outStockIngredients") // div that contains out-of-stock ingr.
var $editForm = $(".edit_form");                 // form to alter in-stock state
var $outForm = $(".out_form");                   // form to alter out-of-stock state

// called through $NewForm.submit(...)
var onSuccess = function(data, status) {
  console.log('We are onSuccess...');
  $inStockFormDiv.append(data);
};

// handles the error case for all .error functions in this file
var onError = function(data, status) {
  console.log("status", status);
  console.log("error", data);
};

$newForm.submit(function(event) {
  // grabs information from form and stores them when button submitted
  console.log('submitted form...');
  event.preventDefault();
  var name = $newForm.find("#nameField").val();
  var cost = $newForm.find("#costField").val();
  var available = true;

  var NewData = {
    itemName: name,
    cost: cost,
    inStock: available
  }

  $.post("addIngredient", NewData)
    .done(onSuccess)
    .error(onError);
});


$editForm.submit(function (event){
  // moves in-stock to out-stock
  console.log('deleted ingredient from in-stock');
  event.preventDefault();
  var postData = {id:$(this).attr("id")};

  $.post("moveIngredient", postData)
    .done(onSuccessMoveOut)
    .error(onError);
});

$outForm.submit(function (event){
  // form that alters the out of stock cases
  console.log('adding ingredient from in-stock');
  event.preventDefault();
  var postData = {id:$(this).attr("id")};

  $.post("moveBackInIngredient", postData)
    .done(onSuccessMoveIn)
    .error(onError);
});

var onSuccessMoveOut = function(data, status) {
  console.log('We are onSuccessMoveOut...');
  $currentForm = $('#'+data._id);
  $currentForm.remove();
  $outStockFormDiv.append($currentForm);
  console.log(data);
};

var onSuccessMoveIn = function(data, status) {
  console.log('We are onSuccessMoveIn...');
  $currentForm = $('#'+data._id);
  $currentForm.remove();
  $inStockFormDiv.append($currentForm);
  console.log(data);
};

$(".edit-button").click(function (event){
  // edit the field when clicked
  console.log('editted ingredient from in-stock');
  event.preventDefault();
 
  var name = $(this).parent().find("#editItemName").val();
  var cost = $(this).parent().find("#editPrice").val();
  var formID = $(this).parent().attr('id');

  var postData = {
    id : formID,
    itemName : name,
    cost : cost
  }

  $(this).siblings('span').html(postData.itemName + " - $" + postData.cost);

})

$(".order-checkbox").change(function (event){
// takes care of case where button is checked
  var total = 0;

  $("input:checked").each(function(){
    total += Number($(this)
          .parent()
          .siblings('.info-ingr')
          .children('.cost-of-ingr').html())
  })

  $('.final-res').children('.total-cost').html(total);

})

$('#btn-order').click(function(){
  // gets the id's of the boxes checked.
  console.log('hello buttons');
  var checked_boxes = $('.order-checkbox:checked');
  var ids_of_ingr = []

  checked_boxes.parent().parent().each(function(){
    ids_of_ingr.push(String($(this).attr('id')));
  })
  console.log(ids_of_ingr);

  var Obj_res = {
    'ingredients': ids_of_ingr.toString()
  }

  console.log(Obj_res);

  $.post('/submitOrder',Obj_res, function(){
    $('#result').html('You just completed your order!')
  });
})

$('.btn-order-completed').click(function (){
  // Remove the order we completed in the kitchen
  orderID = $(this).parent().parent().attr('id');
  console.log(orderID);
  $('#'+orderID).remove();

  $.post('/kitchenOrders', {'idToDelete': orderID}, function (){})

})