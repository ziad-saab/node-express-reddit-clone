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
        elem.attr( "src", "/green-upvote.png");
        elem.parent().find(".downvote").attr("src", "/grey-downvote.png");
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
        elem.attr("src", "/red-downvote.png");
        elem.parent().find(".upvote").attr("src", "/grey-upvote.png");
      });
  });
});
