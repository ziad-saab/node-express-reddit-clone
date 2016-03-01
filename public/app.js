var $ = require('jquery');
var React = require("react");
var ReactDOM = require('react-dom');
var f = require('isomorphic-fetch');


$(document).ready(function(){
    var selector = window.location.pathname.substring(1);
    try {
       $('#'+ selector).toggleClass("selectedTab")
    }
    catch(e) {}


function makeAjaxCallAndGetTitle(url, cb) {
    $.get('/userReq?url=' + url).then(
        function(item){
            var title = item;
            cb(title);
        }
        );
}

$('#sugg').on('click', function(){
        var url = $('#theUrl').val();
        
        makeAjaxCallAndGetTitle(url, function(item){
            $('#theTitle').val(item)
        })
      }
   )
$('.votes').on('click', function(){
    
})

$('.hide').on('click', function(e){
    $(this).parents('.container').fadeToggle();
    return false;
    
    //.animate({opacity: '0px', height: '0px'},1500, function(){$(this).parents('.container').css('display','none')})
        
        
    
})


////RECEIVE AJAX CALL FOR VOTES /////
$('.voteForm').on('submit', function(e){
    e.preventDefault();
    var $this = $(this);
    var data = {
        contentId: $this.find("input[name=contentId]").val(),
        upVote: $this.find("input[name=upVote]").val()
    };
    
     $.post('/voteContent', data).done(
         function(x){
            $this.parent().find('p').text(x.newVoteScore)
         })
})
})

//////// COMMENT BOX and POST ////////////


function serialize(data) {
    return Object.keys(data).map(function (keyName) {
        return encodeURIComponent(keyName) + '=' + encodeURIComponent(data[keyName])
    }).join('&');
};

var CommentBox = React.createClass({
    
    getInitialState: function() {
        return {
            displayed: false,
            comments: [],
            loading: false
        };
    },
    loadComments: function() {
        var that = this;
        f('/comments/8', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            method: 'GET',
        }).then(
            function(r) {
                return r.json(); // this parses the response as JSON to an object
            }
        ).then( function(result){
            that.setState({
            displayed: true,
            comments: result
                })
        })
    },
    sendComment: function(e) {
        e.preventDefault();

        var text = this.refs.textInput.value;
        var id = this.refs.contentInput.value;

        var that = this; // why are we doing this??? IF YOU DO NOT KNOW PLEASE ASK!!

        f('/createComment', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            body: serialize({commentText: text, contentId: id}), // this encodes to text=hello+world&contentId=123
            method: 'POST',
            credentials: 'same-origin' // this will send our cookies
        }).then(
            function(r) {
                // r is the response from the server as a JSON string

                return r.json(); // this parses the response as JSON to an object
            }
        ).then(
            function(result) {
                // result is the response from the server as an actual object

                // here we can finally add the new comment!!                // WHY ARE WE USING that INSTEAD OF this???
                that.state.comments.unshift({
                    id: result.id,
                    text: result.comment,
                    postedBy: result.postedBy
                });

                // calling this.setState will make React re-render the component
                that.setState({
                    comments: that.state.comments
                });
            }
        );
    },
    render: function() {
        if (this.state.displayed) {
            var contentId = window.location.pathname.split('/')[2];

            var commentList = this.state.comments.map(
                function(comment) {
                    return (
                        <li key={comment.id}>
                            <p>{comment.text}</p>
                            <p>Posted by: {comment.postedBy}</p>
                        </li>
                    )
                }
            )

            return (
                <div>
                    <form onSubmit={this.sendComment}>
                        <input ref="contentInput" type="hidden" name="contentId" value={contentId} />
                        <textarea ref="textInput" name="commentText"></textarea>
                        <button type="submit">Go!</button>
                    </form>
                    <ul className="comments-list">
                        {commentList}
                    </ul>
                </div>
            );
        }
        else {
            return (
                <div>
                    <button onClick={this.loadComments}>Load Comments</button>
                </div>
            );            
        }
    }
});

ReactDOM.render(<CommentBox />, document.getElementById('commentBox'))
