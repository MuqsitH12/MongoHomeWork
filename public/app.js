// Grab the funnies as a json
$(document).on("click", "#getstarted",function() {
  $("#getstarted").hide();
  $.getJSON("/funnies", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#funnies").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "<br> <img src=" + data[i].thumbnail + ">" + "<button data-id='" + data[i]._id + "' id='note'>Note</button>" + "<div class=notesection id=" + data[i]._id + "></div>" + "</p>");
    }
  });
});
// Scrape new funnies
$(document).on("click", "#scrape", function(){
  console.log("Scrape test")
})


// Whenever someone clicks a p tag
$(document).on("click", "#note", function() {
  // Hide the note button so you can only edit one at a time
  $("#note").hide();
  // Empty the notesection from the note section
  $("#"+ thisId).empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");
  console.log(thisId)

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/funnies/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#"+ thisId).append("<h6>" + data.title + "</h6>");
      // An input to enter a new title
      $("#"+ thisId).append("<input id='titleinput' name='title' ><br>");
      // A textarea to add a new note body
      $("#"+ thisId).append("<textarea id='bodyinput' name='body'></textarea><br>");
      // A button to submit a new note, with the id of the article saved to it
      $("#"+ thisId).append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
      // A button to delete the note.
      $("#"+ thisId).append("<button data-id='" + data._id + "' id='deletenote'>Delete Note</button>");


      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/funnies/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notesection section
      $("#"+ thisId).empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
  // Show the note button so you can continue to edit
  $("#note").show();
});

// When you click the delete note button
// When you click the savenote button
$(document).on("click", "#deletenote", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "DELETE",
    url: "/funniesdelete/" + thisId
  })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      // Empty the notesection section
      $("#"+ thisId).empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
  // Show the note button so you can continue to edit
  $("#note").show();
});