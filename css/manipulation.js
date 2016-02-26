$("#upVoteBtn").click(function(e) {
    e.preventDefault();
    var contentId = $("#upVoteContentId").val();
    $.ajax({
        method: "POST",
        url: "/voteContent",
        data: {
            contentId: contentId
        }
    }).done(function(data) {
        var currentValue = $("." + contentId).text();
        if (!$("#" + contentId).hasClass("upvoted") && currentValue < 1 ) {
             $("." + contentId).empty().text((Number(currentValue) + 1).toString());
            $("#" + contentId).addClass("upvoted");
        } else  {
            $("#" + contentId).removeClass("upvoted");
            $("." + contentId).empty().text((Number(currentValue) - 1).toString());
        }
        if($("#" + contentId).hasClass("downvoted")) {
            $("." + contentId).empty().text((Number(currentValue) + 2).toString());
            $("#" + contentId).addClass("upvoted");
            $("#" + contentId).removeClass("downvoted");
        }
        
        
    });
});

$("#downVoteBtn").click(function(e) {
    e.preventDefault();
    var contentId = $("#downVoteContentId").val();
    $.ajax({
        method: "POST",
        url: "/voteContent",
        data: {
            contentId: contentId
        }
    }).done(function(data) {
        var currentValue = $("." + contentId).text();
        if (!$("#" + contentId).hasClass("downvoted")) {
            $("." + contentId).empty().text((Number(currentValue) - 1).toString());
            $("#" + contentId).addClass("downvoted");
        }
        else  {
            $("#"+ contentId).removeClass("downvoted");
            $("." + contentId).empty().text((Number(currentValue) + 1).toString());
        }
         if ($("#" + contentId).hasClass("upvoted")) {
            $("." + contentId).empty().text((Number(currentValue) - 2).toString());
            $("#" + contentId).addClass("downvoted");
            $("#" + contentId).removeClass("upvoted");
        } 
        
    });
})