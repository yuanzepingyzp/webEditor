var sharedb = require('sharedb/lib/client');
var richText = require('rich-text');
// var Quill = require('quill');
// require('jquery.caret');
var Delta = require('quill-delta');
sharedb.types.register(richText.type);

//创建编辑器
var editor = new Simditor({
  textarea: $('#editor'),
  mention:{
    items:[
      {
        id:1,
        name:"春雨",
        pinyin:"chunyu",
        abbr:"cy",
        url:"http://www.example.com"
      },
      {
        id:2,
        name:"夏荷",
        pinyin:"xiahe",
        abbr:"xh",
      },
      {
        id:3,
        name:"秋叶",
        pinyin:"qiuye",
        abbr:"qy",
      },
      {
        id:4,
        name:"冬雪",
        pinyin:"dongxue",
        abbr:"dx",
      },
    ],
  },
  toolbar: [
          'undo',
          'redo',
        'title',
        'bold',
        'italic',
        'underline',
        'strikethrough',
        'fontScale',
        'color',
        'ol',             
        'ul', 
        'checklist',            
        'blockquote',
        'code',          
        'table',
        'link',
        'image',
        'video',
        'hr',             
        'indent',
        'outdent',
        'alignment',
        'blank',
        'Radiolist',
        'block',
        'comment',
        'pdf'
        // 'preview',
        // 'version',
        // 'save'
      ]
});

// WebSocket 连接 ShareDB;
var socket = new WebSocket('ws://' + window.location.host);
var connection = new sharedb.Connection(socket);

// For testing reconnection
window.disconnect = function() {
  connection.close();
};
window.connect = function() {
  var socket = new WebSocket('ws://' + window.location.host);
  connection.bindToSocket(socket);
};

//向字符串插入指定字符
String.prototype.insert = function(index, str){
  return this.substring(0, index) + str + this.substr(index);
}
//删除字符串中指定位置字符
String.prototype.delete = function(index, num){
  return this.substring(0, index) + this.substr(index+num);
}

//将操作应用于字符串
Delta.prototype.apply = function(str){
  var operation = this;
  j = 0;
  var strIndex = 0;
  var ops = this.ops;
  for (var i = 0, l = ops.length; i < l; i++) {
    var op = ops[i];
    if (op.hasOwnProperty("retain")) {
      strIndex += op.retain;
    } else if (op.hasOwnProperty("insert")) {
      str = str.insert(strIndex, op.insert);
      strIndex += op.insert.length;
    } else {
      str = str.delete(strIndex, op.delete);
    }
  }
  return str;
}

// Create local Doc instance mapped to 'examples' collection document with id 'richtext'
var doc = connection.get('examples', 'richtext');

//重服务器订阅文档
doc.subscribe(function(err) {
  if (err) throw err;
  // var quill = new Quill('#quillEditor', {theme: 'snow'});
  // quill.setContents(doc.data);
  var read = doc.data.apply('');
  var simditor = $(".simditor-body");
  simditor.html(read);
  var prevString = simditor.html();
  var prevDelta;
  editor.on('valuechanged', function() {
    // if (source !== 'user') return;
    // 
    prevDelta = new Delta().insert(prevString);
    var afterDelta = new Delta().insert($(".simditor-body").html());
    var diff = prevDelta.diff(afterDelta);
    doc.submitOp(diff, {source: editor});
    prevDelta = new Delta().insert(simditor.html());
  });

  //每当接收到新的操作时执行
  doc.on('op', function(op, source) {
    prevString = simditor.html();
    var prevCursor = simditor.caret('pos');
    console.log(prevCursor);
    if (source === editor) return;
    var delta = new Delta(op);
    var result = delta.apply(prevString);
    simditor.html(result);
    simditor.caret('pos', prevCursor);
    prevString = result;
  });
});
