$(document).ready(function() {
  $(".allComments").on("click", ".commentUpvote", function() {
    var elem = $(this);
    var commentId = elem.attr("data-comment");
    $.ajax({
      type:'POST',
      url:'/commentupvote',
      data: {commentId: commentId},
    }).success(function (data){
      console.log('successful upvote');
      var downvote = elem.parent().find(".commentDownvote");
      var metatext = elem.closest(".commentNest").find(".metatext");
      var votescore = metatext.find(".commentScore").first();
      var score = parseInt(votescore.text()) + 1;
      console.log("score is " + score);
      if (downvote.attr("src") === "/images/red-downvote.png")
      score ++;
      if (elem.attr("src") === "/images/green-upvote.png")
      score --;
      console.log("score set to " + score);
      elem.attr( "src", "/images/green-upvote.png");
      downvote.attr("src", "/images/grey-downvote.png");
      votescore.text(score);
      if(score === 1)
      metatext.find(".pointString").first().text("point");
    });
  });
  $(".allComments").on("click", ".commentDownvote", function() {
    var elem = $(this);
    var commentId = $(this).attr("data-comment");
    $.ajax({
      type:'POST',
      url:'/commentdownvote',
      data: {commentId: commentId},
    }).success(function (data){
      console.log('successful downvote');
      var upvote = elem.parent().find(".commentUpvote");
      var metatext = elem.closest(".commentNest").find(".metatext");
      var votescore = metatext.find(".commentScore").first();
      var score = parseInt(votescore.text()) - 1;
      console.log("score is " + votescore.val());
      console.log("score is " + score);
      if (elem.attr("src") === "/images/red-downvote.png")
      score ++;
      if (upvote.attr("src") === "/images/green-upvote.png")
      score --;
      console.log("score set to " + score);
      elem.attr("src", "/images/red-downvote.png");
      upvote.attr("src", "/images/grey-upvote.png");
      votescore.text(score);
      if(score === 1)
      metatext.find(".pointString").first().text("point");
    });
  });
});
