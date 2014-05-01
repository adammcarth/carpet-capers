// Set the form as a variable to make life easy
var calculationForm = $("form#calculation_form")

calculationForm.submit(function() {
  event.preventDefault();
  // Prevent field changes once form has been submitted
  $(".integer").prop("readonly", true);

  // Query the '/calculate' route in the background with the form parameters
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
    // Show the area/broadloom calculations if "Calculate Area" is clicked
    $.each( data, function( key, val ) {
      $("#" + key + " .right .areas .meters").html(val.area + "m&sup2;");
      $("#" + key + " .right .areas .broadloom").html(val.broadloom + "b&sup2;");
    });
  }
});

// Add a new room
$("#addRoom").on('click', function() {
    // Gets last room number from a hidden input field, .roomNum, and adds 1 to it
    var next_room_number = parseInt($(".roomNum").last().val()) + 1

    // Append the html markup for the new room to be displayed
    $("#rooms").append('' +
      '<div id="' + next_room_number + '" class="room" style="display:none; margin-top:40px;">' +
        '<div class="left">' +
          '<h2>Room ' + next_room_number + ' <span id="removeRoom">&times;</span></h2>' +
          '<input type="hidden" class="roomNum" value="' + next_room_number + '">' +
          '<input type="number" step="any" class="integer" name="measurements[' + next_room_number + '][width]" placeholder="Width" required="true">' +
          '<input type="number" step="any" class="integer" name="measurements[' + next_room_number + '][height]" placeholder="Height" required="true">' +
          '<input type="submit" class="btn" value="Calculate Area">' +
        '</div><!-- /.left -->' +
        '<div class="right">' +
          '<div class="areas" style="margin-top:57px;">' +
            '<div class="area meters">0m&sup2;</div>' +
            '<div class="area broadloom">0b&sup2;</div>' +
          '</div><!-- /.areas -->' +
          '<div class="select_quality">' +
            '<b>Carpet Quality:</b> <select name="measurements[' + next_room_number + '][carpet_type]">' +
              '<option value="standard">Standard</option>' +
              '<option value="premium">Premium</option>' +
              '<option value="executive">Executive</option>' +
            '</select>' +
          '</div><!-- /.select_quality -->' +
        '</div><!-- /.right -->' +
        '<div class="clear"></div>' +
      '</div><!-- /room ' + next_room_number + ' -->'
    );

    // Show the html we just appended by sliding it down (it's is set to display:none; initially)
    $("#" + next_room_number).slideDown(200);
});

// Remove a specific room (first room can't be removed)
$("#removeRoom").on('click', function() {
  $("#removeRoom").closest(".room").remove();
});

// GENERATE QUOTE button is pressed
$(".btn_finish").click(function() {
  // If integer fields validate
  if(calculationForm[0].checkValidity() === true) {
    // Disable the button, what's the point of re-calculating the quote with the same values?
    $(this).addClass("disabled");
    $(this).attr("disabled", true);

    // Submit the calculation form again to get the prices
    $.ajax({
    dataType: "json",
    type: calculationForm.attr("method"),
    url: calculationForm.attr("action"),
    data: calculationForm.serialize(),
    success: showQuote,
    complete: function() {
      $("#calculation_form").slideUp(500);
      // Show the back button
      $(".btn_restart").show();
    }
  });
  } else {
    // Integer fields didn't validate
    alert("One or more of your measurements are missing or incorrect. Clicking on 'Calculate Area' will help you find your error.");
  }

  // Called when the room calculations are successfully retrieved
  function showQuote(data) {
    // For each room, add a row to the quote table with it's specs
    // (like broadloom meters, carpet_type, price etc...)
    $.each(data, function(key, val) {
      $(".quote table tbody").append('' +
        '<tr>' +
        '<td>Room ' + key + ' &mdash; <b style="font-size:14px;">' + val.broadloom + 'b&sup2;</b></td>' +
        '<td style="text-transform:capitalize;">' + val.carpet_type + '</td>' +
        '<td>$' + val.cost + '</td>' +
        '<td>-</td>' +
        '</tr>'
      );

      // If the 'discounts' key exists in the data returned by the API,
      // calculate the new price (normal cost price - discounted price).
      if (val.discount) {
        var newprice = val.cost - ((val.discount / 100) * val.cost)
        $(".quote table tbody tr td").last().text(val.discount + "% ($" + newprice + ")");
      }
    });

    // Add the new price to the subtotal. This will also apply to the calculations
    // of GST & ultimately the Grand Total.
    var subtotal = 0
    $.each(data, function(key, val) {
      subtotal = subtotal + parseInt(val.cost)
      if (val.discount) {
        var newprice = val.cost - ((val.discount / 100) * val.cost)
        if (newprice == 0) {
          subtotal = subtotal - val.cost
        } else {
          subtotal = subtotal - newprice
        }
      }
    });
    $("#subtotal span").text(subtotal);

    // Calculate GST
    var gst = 0
    gst = gst + subtotal * 0.1
    $("#gst span").text(gst);

    // Calculate Grand Total
    var grandtotal = subtotal + gst
    $("#grandtotal span").text("$" + grandtotal);

    // FINALLY, slide the quote container down and show everything we've been
    // alluding to.
    $(".quote").delay(700).slideDown(500);
  }
});

// When the back button is clicked
$(".btn_restart").click(function() {
  // Re-hide the back button
  $(this).hide();
  // Re-activate the GENERATE QUOTE button
  $(".btn_finish").removeClass("disabled");
  $(".btn_finish").attr("disabled", false);

  // Reset the quote table (delete its contents) so we don't duplicate it's contents
  // next time an quote is generated.
  $(".quote table tbody").html("");

  // Slide the quote page up and re-show the calculation form (first page).
  $(".quote").slideUp(500);
  $("#calculation_form").delay(700).slideDown(500);
});