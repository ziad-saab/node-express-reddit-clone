$(document).ready(function() {
    
    $("button[name='vote']").click(function() {
        var postId = $(this).attr("data-post-postid");
        var voteDirection = $(this).attr("value");
        //console.log(value);
        //console.log(voteDirection);
        fetch('/vote', {
            method: 'post',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({postId: postId, vote: voteDirection})
        })
        .then(res => res.json())
        .then(res => {
            console.log(res);
            //console.log("Element=",$(this).parent().getElementById("postListScore"));
            //$("#postListScore").load('/');
        });
    });
    
    
});

function reloadElementById(ElementId){
    console.log("Reloading ElementId=", ElementId);
    var container = document.getElementById(ElementId);
    var content = container.innerHTML;
    container.innerHTML= content;
}