$(document).ready(function() {
  $(".reply").click(function() {
    var contentId = $(this).attr("data-content");
    var commentId = $(this).attr("data-comment");
    var classname = "replyButton" + commentId;
    var elem = $(this).parent().parent().parent().parent();
    if(!elem.find("." + classname).attr("name")) {
      elem.after("<div> \
      <input type=\"text\" class=\"replytext\" name=\"comment\" value=\"\" maxLength=\"255\"\> \
      <input class=\"" + classname + "\" data-content=" + contentId + " data-comment=" + commentId + " type=\"submit\" name=\"submit\"\> \
      </div>");
      $("." + classname).on("click", function() {
        var contentId = $(this).attr("data-content");
        var commentId = $(this).attr("data-comment");
        var text = $(this).parent().find(".replytext").val();
        $.ajax({
             type:'POST',
             url:'/comment',
             data: {contentId: contentId, commentId: commentId, text: text},
          }).success(function(data) {

          });
      });
    }
  });

});
