var $ = require('jquery');
$(document).ready(function() {
  $(".allComments").on("click", ".commentUpvote", function() {
    var elem = $(this);
    var commentId = elem.attr("data-comment");
    $.ajax({
      type:'POST',
      url:'/commentupvote',
      data: {commentId: commentId},
    }).success(function (data){
      var downvote = elem.parent().find(".commentDownvote");
      var metatext = elem.closest(".commentNest").find(".metatext");
      var votescore = metatext.find(".commentScore").first();
      var score = parseInt(votescore.text()) + 1;
      if (downvote.attr("src") === "/images/red-downvote.png")
      score ++;
      if (elem.attr("src") === "/images/green-upvote.png")
      score --;
      elem.attr( "src", "/images/green-upvote.png");
      downvote.attr("src", "/images/grey-downvote.png");
      votescore.text(score);
      if(score === 1)
      metatext.find(".pointString").first().text("point");
    }).fail(function(data){
      displayLoginBox();
    });;
  });
  $(".allComments").on("click", ".commentDownvote", function() {
    var elem = $(this);
    var commentId = $(this).attr("data-comment");
    $.ajax({
      type:'POST',
      url:'/commentdownvote',
      data: {commentId: commentId},
    }).success(function (data){
      var upvote = elem.parent().find(".commentUpvote");
      var metatext = elem.closest(".commentNest").find(".metatext");
      var votescore = metatext.find(".commentScore").first();
      var score = parseInt(votescore.text()) - 1;
      if (elem.attr("src") === "/images/red-downvote.png")
      score ++;
      if (upvote.attr("src") === "/images/green-upvote.png")
      score --;
      elem.attr("src", "/images/red-downvote.png");
      upvote.attr("src", "/images/grey-upvote.png");
      votescore.text(score);
      if(score === 1)
      metatext.find(".pointString").first().text("point");
      else metatext.find(".pointString").first().text("points");
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
