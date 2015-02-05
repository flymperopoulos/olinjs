var $form = $("#ajax-form-ingredients");

var onSuccess = function(data, status) {
  var newIngredient = "<p>"+data+"'</p>";

  $("#result").html(newIngredient);
};

var onError = function(data, status) {
  console.log("status", status);
  console.log("error", data);
};

$form.submit(function(event) {
  event.preventDefault();
  var name = $form.find("#nameField").val();
  var cost = $form.find("#costField").val();
  $.post("/ingredients", {
    name: name,
    cost: cost
  })
    .done(onSuccess)
    .error(onError);
});