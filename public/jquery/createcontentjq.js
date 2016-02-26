$(document).ready(function() {
  //set default left position of Post forms
  $(".linkPost").css("left", $("body").width()/2 - $(".linkPost").width()/2);
  $(".selfPost").css("left", $("body").width()/2 - $(".selfPost").width()/2);
  $(".linkPost").fadeIn(300);
  //Clicking sign up link
  $('.linkButton').click(function() {
    //hide selfPost if it is there
    $(".selfPost").hide();
    //reset input-field text
    $('.input-field').val('');

    //centering
    $(".linkPost").css("left", $("body").width()/2 - $(".linkPost").width()/2);
    //Fade in the form
    $(".linkPost").fadeIn(300);
  });
  $('.selfButton').click(function() {
    //hide linkPost if it is there
    $(".linkPost").hide();

    //centering
    $(".selfPost").css("left", $("body").width()/2 - $(".selfPost").width()/2);
    //Fade in the form
    $(".selfPost").fadeIn(300);
  });
});
