$(document).ready(function() {
  $(".reply").on("click", showReplyBox);

  $(".replySaveButton").on("click", submitReply);

  $(".replyCancelButton").on("click", hideReplyBox);
});

function hideReplyBox() {
  var replyBox = $(this).parent().parent();
  replyBox.css("display","none");
}

function showReplyBox() {
  var replyBox = $(this).parent().parent().parent().parent().parent().find(".hiddenReplyBox");
  replyBox.first().css("display","flex");
}

function submitReply() {
  var parent = $(this).closest(".hiddenReplyBox");
  if(!parent.attr("data-content"))
  parent = $(this).closest(".replyBox");
  var textbox = parent.find(".replyTextBox");
  var text = textbox.val();

  if (text === '')
  return;

  var contentId = parent.attr("data-content");
  var commentId = parent.attr("data-comment");
  if (commentId === 'true')
  commentId = null;

  $.ajax({
    type:'POST',
    url:'/comment',
    data: {contentId: contentId, commentId: commentId, text: text}
  }).success(function(data) {
    console.log(data);
    textbox.val('');
    var commentHtml =
    '<div class="commentNest"> \
      <div class="commentRow" key=' + data.comment.id + '> \
        <div class="commentVotescore"> \
          <input class="upvote" data-content=' + data.comment.id + ' type="image" src="/images/grey-upvote.png"/> \
          <p class="votescore">0</p> \
          <input class="downvote" data-content=' + data.comment.id + ' type="image" src="/images/grey-downvote.png"/> \
        </div> \
        <div class="commentContent"> \
          <a class="commentText">' + data.comment.text + '</a> \
          <div class="commentMeta"> \
            <div class="submissionInfo"> \
              <a class="metatext">Post by ' + data.user.username + '</a> \
              <a class="metatext">' + data.comment.createdAt.toString() + '</a> \
              <a class="metalink reply">reply</a> \
            </div> \
          </div> \
        </div> \
      </div> \
      <div class="hiddenReplyBox" data-content=' + data.content.id + ' data-comment=' + data.comment.id + '> \
        <textarea class="replyTextBox" type="text"/> \
          <div class="commentButtons"> \
            <a class="replySaveButton">save</a> \
            <a class="replyCancelButton">cancel</a> \
          </div>\
      </div> \
    </div>';

    if (commentId) {
      parent.css("display","none");
      parent.after(commentHtml);
    }
    else {
      parent.parent().find(".allComments").first().prepend(commentHtml);
    }
  $(".reply").unbind()
  $(".reply").on("click", showReplyBox);
  $(".replySaveButton").unbind()
  $(".replySaveButton").on("click", submitReply);
  $(".replyCancelButton").unbind()
  $(".replyCancelButton").on("click", hideReplyBox);
});
}
