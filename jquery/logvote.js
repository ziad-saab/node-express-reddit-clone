var $ = require('jquery');

$(document).ready(function() {

  $(".upvote").click(function() {
    var elem = $(this);
    var contentId = elem.attr("data-content");
    $.ajax({
         type:'POST',
         url:'/upvote',
         data: {contentId: contentId},
      }).success(function (data){
        console.log('successful upvote');
        var downvote = elem.parent().find(".downvote");
        var votescore = elem.parent().find(".votescore");
        var score = parseInt(votescore.text()) + 1;
        if (downvote.attr("src") === "/images/red-downvote.png")
        score ++;
        if (elem.attr("src") === "/images/green-upvote.png")
        score --;
        elem.attr( "src", "/images/green-upvote.png");
        elem.parent().find(".downvote").attr("src", "/images/grey-downvote.png");
        votescore.text(score);
      }).fail(function(data){
        displayLoginBox();
      });
  });
  $(".downvote").click(function() {
    var elem = $(this);
    var contentId = $(this).attr("data-content");
    $.ajax({
         type:'POST',
         url:'/downvote',
         data: {contentId: contentId},
      }).success(function (data){
        console.log('successful downvote');
        var upvote = elem.parent().find(".upvote");
        var votescore = elem.parent().find(".votescore");
        var score = parseInt(votescore.text()) - 1;
        if (elem.attr("src") === "/images/red-downvote.png")
        score ++;
        if (upvote.attr("src") === "/images/green-upvote.png")
        score --;
        elem.attr("src", "/images/red-downvote.png");
        upvote.attr("src", "/images/grey-upvote.png");
        votescore.text(score);
      }).fail(function(data){
        displayLoginBox();
      });
  });
});

function displayLoginBox(){
  //THIS IS SAME CODE FROM popbox.js TO DISPLAY LOGIN BOX
  //hide loginbox if it has been clicked
  $(".signupbox").hide();
  //remove error message
  $('.error').text('');
  //remove previous input text
  $('.input-field').val('');

  var placement = $("body").width()/2 - $(".loginbox").width()/2;
  $(".loginbox").css("left", placement);
  //Fade in the Popup
  $(".loginbox").fadeIn(300);

  //apply the mask which will grey out background
  $('body').append('<div id="mask"></div>');
  $('#mask').unbind();
  $('#mask').on("click", fadeOut);
  $('#mask').fadeIn(300);
  $('a.close').on("click", fadeOut);
}
