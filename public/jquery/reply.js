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
  var replyBox = $(this).closest(".commentNest, .rootNest").find(".hiddenReplyBox");
  replyBox.first().css("display","flex");
}

function submitReply() {
  var parent = $(this).closest(".hiddenReplyBox");
  if(!parent.attr("data-content"))
  parent = $(this).closest(".replyBox");
  var textbox = parent.find(".replyTextBox");
  var text = textbox.val();
  console.log(text);
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
    var permalink = `/link/${data.content.id}/comments/${data.comment.id}`;
    var parentLink = createParentLink(commentId, data.content.id);
    var submitterLink = `/user/${data.user.username}`;
    var commentHtml =
    `<div class="commentNest">
    <div class="commentRow" key=${data.comment.id}>
      <div class="commentVotescore">
        <input class="commentUpvote" data-comment=${data.comment.id} type="image" src="/images/green-upvote.png"}/>
        <input class="commentDownvote" data-comment=${data.comment.id} type="image" src="/images/grey-downvote.png"/>
      </div>
      <div class="commentContent">
        <div class="commentMeta">
          <div class="submissionInfo">
            <a class="userLink" href=${submitterLink}>${data.user.username}</a>
            <a class="metatext"> <span class="commentScore">1</span> <span class="pointString">points</span> ${moment(data.comment.createdAt).fromNow()}</a>
          </div>
        </div>

        <table class="commentText">
          <tr>
            <td><a>${data.comment.text}</a></td>
          </tr>
        </table>
        <div class="lowerLinks">
          <a class="metalink" href=${permalink}>permalink</a>
          ${parentLink}
          <a class="metalink reply">reply</a>
        </div>
      </div>
    </div>

    <div class="hiddenReplyBox" data-content=${data.content.id} data-comment=${data.comment.id}>
      <textarea class="replyTextBox" type="text"/>
      <div class="commentButtons">
        <a class="replySaveButton">save</a>
        <a class="replyCancelButton">cancel</a>
      </div>
    </div>
  </div>`

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
  }).fail(function(data){
    displayLoginBox();
  });
}

function createParentLink(parentId, contentId) {
  if (!parentId)
  return '';
  else {
    var parentLink = `/link/${contentId}/comments/${parentId}`
    return  (`<a class="metalink" href=${parentLink}>parent</a>`);
  }
}

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
