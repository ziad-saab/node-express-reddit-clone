var React = require('react');
var Moment = require('moment');

function contentRow(content, vote, submitter, votescore) {
  var upvote = "/images/grey-upvote.png";
  var downvote = "/images/grey-downvote.png";
  var comments = "/link/" + content.id + "/comments";
  if (vote === true) {
    upvote = "/images/green-upvote.png";
  } else if (vote === false){
    downvote = "/images/red-downvote.png";
  }
  var submitterLink = `/user/${submitter}`
  return (
    <div className="contentRow">
      <div className="contentVotescore">
        <input className="upvote" data-content={content.id} type="image" src={upvote}/>
        <p className="votescore">{votescore}</p>
        <input className="downvote" data-content={content.id} type="image" src={downvote}/>
      </div>
      <div className="contentContent">
        <table className="contentTitle">
          <tbody>
            <tr>
              <td><a className="contentpost" href={content.url}>{content.title}</a></td>
            </tr>
          </tbody>
        </table>
        <div className="contentMetaData">
          <div className="submissionInfo">
            <a className="metatext">Submitted {Moment(content.createdAt).fromNow()} by </a>
            <a className="userLink" href={submitterLink}>{submitter}</a>
          </div>
          <a className="metalink" href={comments}>Comments</a>
        </div>
      </div>
    </div>
  )
};

module.exports = contentRow;
