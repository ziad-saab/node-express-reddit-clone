$(".upVoteBtn, .downVoteBtn").click(function(e) {
    var upDown    = $(this).parent().find("input[name='upVote']").val();
    var contentId = $(this).parent().find("input[name='contentId']").val();
    $.ajax({
        method: "POST",
        url: "/voteContent",
        data: {
            contentId: contentId,
            upDown: upDown
        }
    }).done(function(data) {
        var displayedVoteScore = data.voteScore;
        if (data.voteCount > 1 && data.voteScore === 0) {
            displayedVoteScore = -1;
        }
         $("."+contentId).empty().text(displayedVoteScore);
        if(!$("#" + contentId + "upVote").hasClass("upvoted") && displayedVoteScore !== -1){
            $("#" + contentId + "upVote").addClass("upvoted");
        } else {
            $("#" + contentId + "upVote").removeClass("upvoted");
        }
        if($("#" + contentId + "downVote").hasClass("downvoted")) {
            $("#" + contentId + "downVote").removeClass("downvoted");
            $("#" + contentId + "upVote").addClass("upvoted");
        }
    });
});