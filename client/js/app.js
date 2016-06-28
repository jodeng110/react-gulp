var CommentBox = require('./components/CommentBox');

/*
var data = [
  { author: "Taz Kim", text: "언제끝나?~"},
  { author: "Jodeng", text: "6시! *불금*이니깐~!"}
];

// 서버 api호출해서 Comment Data를 가져오기 전 샘플 사용.

ReactDOM.render(
  <CommentBox data={data}/>,
  document.getElementById('content')
);
*/
ReactDOM.render(
  <CommentBox url="/api/comments" pollInterval={2000}/>,
  document.getElementById('content')
);