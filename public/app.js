calculationForm = $("form#calculation_form")

calculationForm.submit(function() {
  event.preventDefault();
  $(".integer").prop("readonly", true);

  $.ajax({
    dataType: "json",
    type: calculationForm.attr("method"),
    url: calculationForm.attr("action"),
    data: calculationForm.serialize(),
    success: showResults,
    complete: function() {
      $(".integer").prop("readonly", false);
    }
  });

  function showResults(data) {
    $.each( data, function( key, val ) {
      $("#" + key + " .right .areas .meters").text(val.area + "m²");
      $("#" + key + " .right .areas .broadloom").text(val.broadloom + "b²");

    });
  }
});