var $newForm = $("#ajax-form-ingredients");

var $inStockFormDiv = $("#inStockIngredients");
var $outStockFormDiv = $("#outStockIngredients")
var $editForm = $(".edit_form");
var $outForm = $(".out_form");

var onSuccess = function(data, status) {
  console.log('We are onSuccess...');
  $inStockFormDiv.append(data);
};

var onError = function(data, status) {
  console.log("status", status);
  console.log("error", data);
};

$newForm.submit(function(event) {
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
  console.log('deleted ingredient from in-stock');
  event.preventDefault();
  var postData = {id:$(this).attr("id")};

  $.post("moveIngredient", postData)
    .done(onSuccessMoveOut)
    .error(onError);
});

$outForm.submit(function (event){
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
  orderID = $(this).parent().parent().attr('id');
  $('#'+orderID).remove();

  $.post('/kitchenOrders', {'idToDelete': orderID}, function (){

  })

})
