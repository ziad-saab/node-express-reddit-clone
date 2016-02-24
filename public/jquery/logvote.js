$(document).ready(function() {
  $(".upvote").click(function() {
    var elem = $(this);
    var contentId = elem.attr("data-content");
    console.log("clicked upvote");
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
      });
  });
});
