$(document).ready(function() {
  $(".allComments").on("click", ".commentUpvote", function() {
    console.log('upvoted');
    var elem = $(this);
    var commentId = elem.attr("data-comment");
    console.log("clicked upvote");
    $.ajax({
      type:'POST',
      url:'/commentupvote',
      data: {commentId: commentId},
    }).success(function (data){
      console.log('successful upvote');
      var downvote = elem.parent().find(".commentDownvote");
      //var votescore = elem.parent().find(".votescore");
      //var score = parseInt(votescore.text()) + 1;
      var score = 0;
      if (downvote.attr("src") === "/images/red-downvote.png")
      score ++;
      if (elem.attr("src") === "/images/green-upvote.png")
      score --;
      elem.attr( "src", "/images/green-upvote.png");
      downvote.attr("src", "/images/grey-downvote.png");
      //votescore.text(score);
    });
  });
  $(".allComments").on("click", ".commentDownvote", function() {
    console.log('downvoted')
    var elem = $(this);
    var commentId = $(this).attr("data-comment");
    console.log(commentId);
    $.ajax({
      type:'POST',
      url:'/commentdownvote',
      data: {commentId: commentId},
    }).success(function (data){
      console.log('successful downvote');
      var upvote = elem.parent().find(".commentUpvote");
      //var votescore = elem.parent().find(".votescore");
      //var score = parseInt(votescore.text()) - 1;
      var score = 0;
      if (elem.attr("src") === "/images/red-downvote.png")
      score ++;
      if (upvote.attr("src") === "/images/green-upvote.png")
      score --;
      elem.attr("src", "/images/red-downvote.png");
      upvote.attr("src", "/images/grey-upvote.png");
      //votescore.text(score);
    });
  });
});
