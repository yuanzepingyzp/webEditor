<template>
	<div class="editer">
	    <div class="tools">
		    <i-button @click="undo" type="ghost">
		    	<Icon type="reply"></Icon>
		    </i-button>
		    <i-button @click="redo" type="ghost">
		    	<Icon type="forward"></Icon>
		    </i-button>
		    <span class="editerTools" v-show="!enableMarkdown">
			    <i-button @click="removeFormat" type="ghost">
			    	<i class="fa fa-eraser" aria-hidden="true"></i>
			    </i-button>
			    <Dropdown>
			        <i-button type="ghost">
			            <i class="fa fa-header" aria-hidden="true"></i>
			            <Icon type="arrow-down-b"></Icon>
			        </i-button>
			        <Dropdown-menu slot="list">
			            <Dropdown-item @click="insertHeader(header)" v-for="header in headerList">
			                <a href="javascript:;">
						    	{{header}}
						    </a>
			            </Dropdown-item>
			        </Dropdown-menu>
			    </Dropdown>
			    <i-select :model.sync="selectedFontSize" style="width:50px">
			        <i-option v-for="item in fontList" :value="item.value" :label="item.label">
			            <a href="javascript:;">{{ item.label }}</a>
			        </i-option>
			    </i-select>
			    <i-button @click="toggleBold" type="ghost">
			    	<i class="fa fa-bold" aria-hidden="true"></i>
			    </i-button>
			    <i-button @click="toggleItalic" type="ghost">
			    	<i class="fa fa-italic" aria-hidden="true"></i>
			    </i-button>
			    <i-button @click="toggleUnderline" type="ghost">
			    	<i class="fa fa-underline" aria-hidden="true"></i>
			    </i-button>
			    <i-button @click="toggleStrike" type="ghost">
			    	<i class="fa fa-strikethrough" aria-hidden="true"></i>
			    </i-button>
			    <i-button @click="indent" type="ghost">
			    	<i class="fa fa-indent" aria-hidden="true"></i>
			    </i-button>
			    <i-button @click="outdent" type="ghost">
			    	<i class="fa fa-outdent" aria-hidden="true"></i>
			    </i-button>
			    <i-button @click="insertOrderedList" type="ghost">
			    	<i class="fa fa-list-ol" aria-hidden="true"></i>
			    </i-button>
			    <i-button @click="insertUnorderedList" type="ghost">
			    	<i class="fa fa-list-ul" aria-hidden="true"></i>
			    </i-button>
			    <Dropdown>
			        <i-button type="ghost">
			            插入
			            <Icon type="arrow-down-b"></Icon>
			        </i-button>
			        <Dropdown-menu slot="list">
			            <Dropdown-item @click="insertLine">
			                <a href="javascript:;">
						    	<Icon type="minus" size="20"></Icon>
						    	<span style="vertical-align:text-bottom"> 分隔线</span>
						    </a>
			            </Dropdown-item>
			            <Dropdown-item @click="insertImage">
			                <a href="javascript:;">
						    	<Icon type="image" size="20"></Icon>
						    	<span style="vertical-align:text-bottom"> 图&emsp;片</span>
						    </a>
			            </Dropdown-item>
			            <Dropdown-item @click="createLink">
			                <a href="javascript:;">
						    	<Icon type="link" size="20"></Icon>
						    	<span style="vertical-align:text-bottom"> 超链接</span>
						    </a>
			            </Dropdown-item>
			            <Dropdown-item @click="insertTable">
			                <a href="javascript:;">
						    	<icon-plus prefix-cls="fa" size="20" type="table"></icon-plus>
						    	<span style="vertical-align:text-bottom"> 表&emsp;格</span>
						    </a>
			            </Dropdown-item>
			        </Dropdown-menu>
			    </Dropdown>
			    <i-select :model.sync="selectedAlign" style="width:80px">
			        <i-option v-for="item in alignList" :value="item.value" :label="item.label">
			            <a href="javascript:;">
			                <i :class="item.icon" aria-hidden="true"></i>
			            </a>
			        </i-option>
			    </i-select>
			    <i-button type="ghost">
			        <input type="color" v-model="selectedColor" style="height: 15px;vertical-align: middle;">
			    </i-button>
		    </span>
		    <i-button type="ghost" @click="insertCheckbox">
		    	<Icon type="android-checkbox-outline"></Icon>
		    </i-button>
			<i-button type="ghost" @click="toggleMarkDown">
			    <span v-show="!enableMarkdown">md</span>
			    <span v-else>富文本</span>
			</i-button>
			<i-button type="ghost" @click="saveAs">
				<i class="fa fa-floppy-o" aria-hidden="true"></i>
			</i-button>
        </div>
        <div class="tableTools" v-show="showTableTool">
		    <Button-group>
		        <i-button type="primary" @click="removeColumns">
		            <Icon type="minus"></Icon>
		            移除列
		        </i-button>
		        <i-button type="primary" @click="addColumns">
		            新增列
		            <Icon type="plus"></Icon>
		        </i-button>
		    </Button-group>
		    <Button-group>
		        <i-button type="primary" @click="removeRows">
		            <Icon type="minus"></Icon>
		            移除行
		        </i-button>
		        <i-button type="primary" @click="addRows">
		            新增行
		            <Icon type="plus"></Icon>
		        </i-button>
		    </Button-group>
        </div>
        <div class="flexBox">
		    <Tooltip content="此处输入markdown" v-show="enableMarkdown" placement="top">
		        <textarea class="markdown" v-model="markdown" placeholder="请输入markdown"></textarea>
		    </Tooltip>
		    <div class="content" contenteditable="true" v-show="!enableMarkdown">
		        {{{content}}}
		    </div>
		    <div class="markdownContent" v-else>
		        {{{content}}}
		    </div>
        </div>
		<div id="editormd">
		    <textarea style="display:none;">### Hello Editor.md !</textarea>
		</div>
	</div>
</template>
<style lang="less">
	table{
		width: 100%;
		td{
			border: 1px solid rgb(200,200,200);
			padding: 5px;
		}
	}
    .flexBox{
    	display: flex;
    	justify-content: center;
    	margin-top: 10px;
    }
    .imgWrap{
    	resize: both;
    	cursor: se-resize;
    	overflow:auto;
    	display: inline-block;
    	max-width: 100%;
    	&:hover{
    	    border:2px dashed rgba(0, 0, 0, 0.4);
    	}
    	img{
    		height: 100%;
    		width: 100%;
    	}
    }
    .markdown{
    	width: 600px;
    	min-width: 500px;
    	padding: 10px;
    	margin-right: 2px;
    	min-height: 1172px;
    	border: none;
    	box-shadow: 0 1px 6px #ccc;
    	font-size: 18px;
    	&:focus{
    		outline: 0;
    	}
    }
    .markdownContent{
    	padding: 50px;
    	min-height: 1172px;
    	width: 600px;
    	min-width: 500px;
    	box-shadow: 0 1px 6px #ccc;
    	background-color: white;
    	font-size: 18px;
    	word-wrap: break-word;
    }
    .ivu-select-item{
    	padding: 0 !important;
    	a{
    		padding: 7px 16px;
    		display: inline-block;
    	}
    }
    .ivu-select-item-selected{
    	a{
    		color: white;
    	}
    }
    .ivu-select-selection{
    	background-color: transparent !important;
    }
    .ivu-dropdown-item{
    	padding: 0 !important;
    	& a{
    		display: inline-block;
            padding: 7px 16px;
    	}
    }
    .editer{
    	padding: 10px;
    	background: #f0f0f0;
    }
    .tools{
    	text-align: center;
    }
    .tableTools{
    	text-align: center;
    	padding-top:10px;
    }
    .content{
    	padding: 100px;
    	min-height: 1172px;
    	width: 816px;
    	box-shadow: 0 1px 6px #ccc;
    	background-color: white;
    	font-size: 18px;
    	&:focus{
    		outline: 0;
    	}
    }
    ol{
    	list-style: decimal !important;
    }
    ul{
    	list-style: square !important;
    }
    .checkboxList{
    	list-style: none !important;
    	li{
    		font-family: Ionicons;
    		pointer-events: none;
    		&:before{
    			content: attr(status-icon);
    			pointer-events: auto;
    		}
    	}
    }
</style>
<script>
var iconPlus = require('../parts/iconPlus.vue');
var markdown = require('markdown').markdown;
	export default{
		data: function(){
			return {
				showTableTool: false,
				selectedFontSize: 4,
				selectedColor: 'white',
				selectedBold: false,
				selectedItalic: false,
				selectedUnderline: false,
				selectedStrike: false,
				selectedAlign: 'justifyLeft',
				markdown: 'Hello *World*!',
				enableMarkdown: false,
				headerList:['H1','H2','H3','H4','H5','H6'],
				fontList: [
					{
						value: 2,
						label: '2'
					},
					{
						value: 3,
						label: '3'
					},
					{
						value: 4,
						label: '4'
					},
					{
						value: 5,
						label: '5'
					},
					{
						value: 6,
						label: '6'
					},
				    {
						value: 7,
						label: '7'
					}
				],
				alignList: [
	 				{
	 					value: 'justifyCenter',
	 					icon: 'fa fa-align-center',
	 					label: '居中'
	 				},
	 				{
	 					value: 'justifyLeft',
	 					icon: 'fa fa-align-left',
	 					label: '左对齐'
	 				},
	 				{
	 					value: 'justifyRight',
	 					icon: 'fa fa-align-right',
	 					label: '右对齐'
	 				},
	 				{
	 					value: 'justifyFull',
	 					icon: 'fa fa-align-justify',
	 					label: '两端对齐'
	 				}
				]
			}
		},
		computed: {
			content: function(){
				return markdown.toHTML(this.markdown);
			}
		},
		methods: {
			undo: function(){
               document.execCommand("Undo",false);
			},
			redo: function(){
				document.execCommand("redo",false);
			},
			removeFormat: function(){
				document.execCommand("RemoveFormat",false);  
			},
			insertHeader: function(header){
				var result = document.execCommand('heading', false, header);
				console.log(result);
			},
            toggleBold: function(){
            	this.selectedBold = !this.selectedBold;
            },
            toggleItalic: function(){
            	this.selectedItalic = !this.selectedItalic;
            },
            toggleUnderline: function(){
            	this.selectedUnderline = !this.selectedUnderline;
            },
            toggleStrike: function(){
            	this.selectedStrike = !this.selectedStrike;
            },
            createLink: function(){
            	document.execCommand('CreateLink', false, 'http://www.baidu.com');
            },
            indent: function(){
            	document.execCommand('indent', false);
            },
            outdent: function(){
            	document.execCommand('outdent', false);
            },
            insertImage: function(){
            	document.execCommand('insertHTML',false, '<i class="imgWrap" contenteditable="false"><img src="./img/logo.png"></i>');
            },
            insertLine: function(){
            	document.execCommand('insertHorizontalRule',false,'linew');
            },
            insertOrderedList: function(){
            	document.execCommand("insertorderedlist");
            },
            insertUnorderedList: function(){
            	document.execCommand("insertunorderedlist");
            },
            insertTable: function(){
            	var vm =this;
            	var id = 'table'+ parseInt(Math.random() * 1000,10);
            	document.execCommand("insertHTML", false, `<table id='${id}'><tr><td>test</td></tr><tr><td>test</td></tr></table>`);
            	document.getElementById(id).addEventListener('click', function(e){
            		try{
            		document.querySelector('.selectedTd').setAttribute('class', '');
            		}catch(error){

            		}
            		e.target.setAttribute('class', 'selectedTd');
            		vm.showTableTool = true;
            	}) ;
            	document.body.addEventListener('click',function(e){
            		if(e.target.className === 'content'){
            			vm.showTableTool = false;
            		}
            	})
            },
            addColumns: function(){
            	var selectedTd = document.querySelector('.selectedTd');
            	var selectedTable = selectedTd.parentNode.parentNode;
            	var rows =selectedTable.children;
            	var newTd = document.createElement('td');
            	for(var i=0;i<rows.length;i++){
            		rows[i].appendChild(newTd);
            	}
            },
            removeColumns:function(){
            	var selectedTd = document.querySelector('.selectedTd');
            	var tdIndex = selectedTd.cellIndex;
            	var selectedTable = selectedTd.parentNode.parentNode;
            	var rows =selectedTable.children;
            	for(var i = 0;i< rows.length;i++){
            		rows[i].deleteCell(tdIndex);
            	}
            },
            addRows: function(){
            	var selectedTd = document.querySelector('.selectedTd');
            	var selectedTable = selectedTd.parentNode.parentNode;
            	var row = selectedTable.insertRow(1);
            	console.log(row);
            },
            removeRows: function(){

            },
            insertCheckbox: function(){
            	var selected = window.getSelection().toString();
            	document.execCommand('insertHTML', false, `<ul class="checkboxList"><li status-icon="&#xF372" onclick="console.log(this.attributes['check-status'].nodeValue);if(this.attributes['check-status'].nodeValue == 'false'){this.setAttribute('status-icon','&#xF373');this.setAttribute('check-status','true')}else{this.setAttribute('status-icon','&#xF372');this.setAttribute('check-status','false')}" check-status=false>${selected}</li></ul>`);
            },
            toggleMarkDown: function(){
            	this.enableMarkdown = !this.enableMarkdown;
            },
            saveAs: function(){
            	document.execCommand('saveAs', false);
            }
		},
		watch: {
			selectedFontSize: function(newval){
                document.execCommand("FontSize",false,newval);
			},
			selectedColor: function(newval){
				document.execCommand("ForeColor",false,newval);
			},
			selectedBold: function(newval){
                document.execCommand("Bold",false,null);
			},
			selectedItalic: function(){
				document.execCommand("Italic",false,null);
			},
			selectedUnderline: function(){
				document.execCommand("Underline",false,null);
			},
			selectedStrike: function(){
				document.execCommand("strikeThrough",false,null);
			},
			selectedAlign: function(newval){
                document.execCommand(newval, false);
			}
		},
		components: {
			iconPlus
		}
	}
</script>