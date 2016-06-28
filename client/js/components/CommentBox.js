/*
  props기반 렌더링은 props가 불변성! , 컴포넌트에 상호작용을 하기 위해서는 가변성을 갖는 state속성 사용!
  this.state는 컴포넌트에 한정(private)하며 this.setState()를 통해 변경가능하다.
  state가 없데이트 되면, 컴포넌트는 자신을 스스로 렌더링 한다.

  props속성을 사용하지 않고 해당 컴포넌트가 서버에서 요청이 들어올떄까지는 아무데이터도 가지고 있지 않다가, 특정한 시점에서 새로운 댓글을 렌더링할 필요가 있을 경우(컴포넌트에 상호작용 위함) 가변성을 갖는 this.state속성을 이용하여 접근한다.
 */

var CommentBox = React.createClass({
  loadCommentsFromServer: function(){
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data){
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err){
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleCommentSubmit: function(comment){
    //TODO : 서버에 요청을 수행하고 목록을 업데이트한다.
    var comments = this.state.data;
    var newComments = comments.concat([comment]);
    this.setState({data: newComments});
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data){
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err){
        this.setState({data: comments});
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function(){
    //getInitialState()는 컴포넌트의 생명주기동안 한번만 실행되며 컴포넌트의 초기 state를 설정
    return {data: []};
  },
  componentDidMount: function(){
    /*
      state 업데이트 하기
      컴포넌트 최초 생성시에, 서버에서 GET방식으로 JSON을 넘겨받아 최신의 데이터가 state에 반영되길 원했다.
      jQuery를 이용해 서버에 비동기 요청을 만들어 필요한 데이터를 빨리 가져올 수 있게 한다.

      componentDidMount는 컴포넌트가 렌더링 된 다음 React에 의해 자동으로 호출되는 메소드.
      동적 업데이트를 하기 위해 'this.setState()'호출 -> UI 업데이트
     */
     this.loadCommentsFromServer();
     //setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function(){
    return (
      <div className="commentBox">
        <h1>Comment Box</h1>
        <CommentList data={this.state.data}/>
        <CommentForm onCommentSubmmit={this.handleCommentSubmit}/>
      </div>
    );
  }
});

module.exports = CommentBox;

var CommentList = React.createClass({
  render: function(){
    var commentNodes = this.props.data.map(function(comment){
      return (
        <Comment author={comment.author}>
          {comment.text}
        </Comment>
      );
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

// 새로운 댓글을 추가하기 위한 입력폼
var CommentForm = React.createClass({
  handleSubmit: function(e){
    e.preventDefault();
    var author = this.refs.author.value.trim();
    var text = this.refs.text.value.trim();
    if(!text || !author){
      return;
    }

    // TODO: 서버에 요청 전송
    this.props.onCommentSubmmit({author: author, text: text});
    this.refs.author.value = '';
    this.refs.text.value = '';
  },
  render: function(){
    /*
      DOM노드를 참조하기 위해 'ref' attribute 사용.
     */
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="이름" ref="author"/>
        <input type="text" placeholder="내용을 입력하세요..." ref="text"/>
        <input type="submit" value="올리기" />
      </form>
    );
  }
});

var Comment = React.createClass({
  rawMarkup: function(){
    var md = new Remarkable();
    var rawMarkup = md.render(this.props.children.toString());
    return { __html: rawMarkup };
  },
  render: function() {
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        <span dangerouslySetInnerHTML = {this.rawMarkup()} />
      </div>
    );
  }
});
