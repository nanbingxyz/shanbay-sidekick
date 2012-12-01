var Chromebay= Chromebay || {};

Chromebay.context={
	jqXHR:null,
	jqXHRCanceled:false,
	word:null,
	ctxId:'chromebay',
	cacheEnabled:true,
	event:null,
	$:function(selector){
		if(selector){
			return $('#'+Chromebay.context.ctxId).find(selector);
		}
		return $('#'+Chromebay.context.ctxId);
	}
}

Chromebay.url={
	query: function(word){
		return 'http://www.shanbay.com/api/word/'+word;
	},
	examples: function(learningID){
		return 'http://www.shanbay.com/api/learning/examples/'+learningID;
	},
	add: function(word){
		return 'http://www.shanbay.com/api/learning/add/'+word;
	}
}


Chromebay.ui={
	data:{},
	animation:function($el){
		var key = $el.attr('id');
		this.start=function(n){
			console.dir($el);
			if(Chromebay.ui.data[key])return;
			var dots='';
			Chromebay.ui.data[key] = setInterval(function(){
				if($el.text()=='....'){
					$el.text('');
				}
				console.debug($el.text());
				$el.text($el.text()+'.');
			},500);
		}
		this.clear=function(){
			if(Chromebay.ui.data[key]){
				window.clearInterval(Chromebay.ui.data[key]);
				Chromebay.ui.data[key]=undefined;
			}
		}

		return this;
	},
	clearAllAnimation:function(){
		for(var i in Chromebay.ui.data){
			 window.clearInterval(Chromebay.ui.data[i]);
		}
	},
	queryLoadingHTML: function(){
		return '<div id="'+Chromebay.context.ctxId+'" class="chromebay"><a href="javascript:void(0)" class="cancel" style="font-size:12px;">取消</a><span style="font-size:12px;">正在查询中</span><span class="query-animation" id="chromebay-animation-1"></span></div>';
	},
	render: function(json){
		if(json.voc==""){
			return '<div class="undefined" style="font-size:12px;">未找到单词<strong>'+Chromebay.context.word+'</strong>对应的解释。</div>';
		}
		Chromebay.cache(json.voc.content,json.voc.definition);
		var html='<div class="word" learning_id="'+json.learning_id+'">';
		if(json.learning_id>0){
			html+='<span class="studied" title="你已经学过这个单词">'+json.voc.content+'</span>';
		}else{ 
			html+=json.voc.content;
		}
		html+='</div>';
		html+='<div class="pron">';
		if(json.voc.pron!=''){
			html+='['+json.voc.pron+']';
		}
		if(json.voc.audio!=''){
			html+='<span class="icon-volume-up speaker" title="发音"></span>';
		}
		html+='<span class="tools">';
		if(json.learning_id>0){
			html+='<a href="http://www.shanbay.com/learning/'+json.learning_id+'" target="_blank">详细</a>';
			html+='<span class="add-status">已在词库中</span>';
		}else{
			html+='<a href="javascript:void(0)" class="add-word">添加</a>';
			html+='<span class="add-status" style="display:none">添加中<span class="add-animation" id="chromebay-animation-2"></span></span>';
		}
		
		html+='</div>';
		html+='<div class="definition">'+json.voc.definition+'</div>';

		var renderEnDefinitions = function(key){
			var enDef = "<ul>";
			for(var i=0;i<json.voc.en_definitions[key].length;i++){
				enDef+='<li>'+json.voc.en_definitions[key][i]+'</li>';
			}
			enDef+='</ul>';
			return enDef;
		}

		html+='<table class="en-definitions" border="0">';
		for(var key in json.voc.en_definitions){
			html+='<tr>'+
			'<td valign="top" align="left" width="10px"><ul style="list-style-type:none;margin-right:2px;"><li>'+key+'</li></ul></td>'+
			'<td valign="top" align="left">'+renderEnDefinitions(key)+'</td>'+
			'</tr>';
		}
		html+='</table>';
		if(json.learning_id>0){
			html+='<div class="examples"><div>正在加载例句<span class="examples-animation" id="chromebay-animation-3"></span></div></div>'
		}
		return '<div id="'+Chromebay.context.ctxId+'" class="chromebay">'+html+'</div>';
	}
}

Chromebay.validator={
	isValidWord:function(word){
		if(!word)return false;
		if($.trim(word)=="")return false;
		if(word.length>70)return false;
		return true;
	}
}

Chromebay.event={
	registerListener:function(json){
		Chromebay.context.$('span[class~="speaker"]').click(function(e){
			Chromebay.context.event=e;
			Chromebay.playMP3(json.voc.audio);
		});
		Chromebay.context.$('a[class="add-word"]').click(function(e){
			Chromebay.context.event=e;
			Chromebay.addWord(json.voc.content);
		});
	}
}

Chromebay.playMP3=function(audioURL){
	if(!$('#chromebay-audio')[0]){
		$(document.body).append('<audio id="chromebay-audio"></audio>');
	}
	$('#chromebay-audio').attr('src',audioURL);
	$('#chromebay-audio')[0].play();
}

Chromebay.query = function(word,$container,onStart,onComplete,onError){
	$('.ui-widget').hide();
	if(Chromebay.validator.isValidWord(word)){
		Chromebay.context.word = word;
		$container.html(Chromebay.ui.queryLoadingHTML());
		Chromebay.ui.animation(Chromebay.context.$('.query-animation')).start();
		if($.isFunction(onStart))onStart(word);

		Chromebay.context.jqXHR=$.ajax({
			url:Chromebay.url.query(Chromebay.context.word),
			complete: function(jqXHR,responseText){
				try{
					var json=$.parseJSON(jqXHR.responseText);
					Chromebay.ui.animation(Chromebay.context.$('.query-animation')).clear();

					if($.isFunction(onComplete))onComplete($container,json);
					$container.html(Chromebay.ui.render(json));
					if(json.learning_id>0){
						Chromebay.examples.load(json.learning_id);
					}
					Chromebay.event.registerListener(json);
				}catch(e){
					console.error(e);
					Chromebay.ui.animation(Chromebay.context.$('.query-animation')).clear();
					if(Chromebay.context.jqXHRCanceled){
						Chromebay.context.jqXHRCanceled=false;
						return;
					}
					var html='<div id="'+Chromebay.context.ctxId+'" class="chromebay">'+
						'<div class="login">'+
							'<a href="http://www.shanbay.com/accounts/login/" target="_blank">登录扇贝</a>'+
							'<span>请检查网络连接，确认可以正常访问扇贝网</span>'+
						'</div>'+
					'</div>';
					$container.html(html);
					if($.isFunction(onError))onError(e,jqXHR,responseText);
				}
			},
			dataType:'html json'
		});
	}
}

Chromebay.addWord = function(word){
	var $a = $(Chromebay.context.event.target);
	$a.fadeOut('fast',function(){
		$a.next().fadeIn('fast',function(){
			Chromebay.ui.animation($a.next().find('.add-animation')).start();
			ajax();
		});
	});

	function ajax(){
		$.ajax({
			url:Chromebay.url.add(word),
			complete:function(jqXHR){
				Chromebay.ui.animation($a.next().find('.add-animation')).clear();
				var success=true;
				var learningID=0;
				if(jqXHR.responseText==''){
					success=false;
				}else{
					var json=$.parseJSON(jqXHR.responseText);
					learningID=json.id;
					if(learningID==0){
						success=false;
					}
				}
				if(success){
					$a.next().html('已添加');
					$a.parent().prepend('<a href="http://www.shanbay.com/learning/'+learningID+'/" target="_blank">详细</a>');
				}else{
					$a.next().html('添加失败').animate({},2000).fadeOut('slow',function(){
						$a.fadeIn('fast');
					});
				}
			}
		});
	}
}


Chromebay.examples={

	load:function(learningID){
		console.dir(Chromebay.context.$('.examples-animation'));
		Chromebay.ui.animation(Chromebay.context.$('.examples-animation')).start();
		$.get(Chromebay.url.examples(learningID),null,function(json){
			if(json.examples_status==1|| json.examples.length>0){
				Chromebay.context.$('.examples').html(Chromebay.examples.render(json));
			}else if(json.examples_status==0 || json.examples.length==0){
				Chromebay.context.$('.examples').html('<div>该词条暂无例句.</div>');
			}
			Chromebay.ui.animation(Chromebay.context.$('.examples-animation')).clear();
		},'json');
	},
	render:function(json){
		var result='';
		for(var i=0;i<json.examples.length;i++){
			result+='<div title="'+(json.examples[i].translation||'暂无翻译')+'">'+
				json.examples[i].first+
				'<span class="entry">'+
				json.examples[i].mid+
				'</span>'+
				json.examples[i].last+
				'</div>';
		}
		return result;
	}
}

Chromebay.cache=function(k,v){
	if(Chromebay.context.cacheEnabled){
		Chromebay.webdb.open();
		Chromebay.webdb.createTable();
		Chromebay.webdb.record(k,v);
		if(Chromebay.autocomplete){
			Chromebay.autocomplete.refreshSource();
		}
	}
}



Chromebay.webdb={
	open: function(){
		var dbSize = 5 * 1024 * 1024;
  		Chromebay.webdb.db = openDatabase("chromebay-db", "1.0", "shanbay-sidekick", dbSize);
	},
	onError:function(tx, e){
		console.error("There has been an error: " + e.message);
	},
	onSuccess:function(tx, e){
		//do noting
	},
	createTable:function(){
  		Chromebay.webdb.db.transaction(function(tx) {
    		tx.executeSql("CREATE TABLE IF NOT EXISTS " +
                  "history(ID INTEGER PRIMARY KEY ASC, word TEXT,definition TEXT, created_at DATETIME)", []);
  		});
	},
	record:function(word,definition,max){
		var w=word.toLowerCase();
		var _max = max || 10;
  		Chromebay.webdb.db.transaction(function(tx){
  			tx.executeSql("SELECT COUNT(*) total FROM history",[],
  				function(tx,rs){
  					if(rs.rows.item(0)['total']>=_max){
  						tx.executeSql(
  							"DELETE FROM history WHERE id = (SELECT MIN(ID) FROM history)",[],
  							Chromebay.webdb.onSuccess,
  							Chromebay.webdb.onError
  						);
  					}
  					tx.executeSql("DELETE FROM history WHERE word = ?",[w],
  						function(tx,r){
  							tx.executeSql(
  								"INSERT INTO history(word,definition,created_at) VALUES (?,?,?)",
				        		[w,definition, new Date()],
				        		Chromebay.webdb.onSuccess,
				        		Chromebay.webdb.onError
				        	);
		   				},
  						Chromebay.webdb.onError
  					);
  				},
  				Chromebay.webdb.onError
  			);
   		});
	},
	queryHistory:function(callback){
		Chromebay.webdb.open();
		Chromebay.webdb.createTable();
		Chromebay.webdb.db.transaction(function(tx){
			tx.executeSql(
				"SELECT *  FROM history ORDER BY id desc",[],
				callback,
				Chromebay.webdb.onError
			)
		});
	}
}




String.prototype.sub = function(n){    
	var r = /[^\x00-\xff]/g;    
	if(this.replace(r, "mm").length <= n) return this;     
	var m = Math.floor(n/2);    
	for(var i=m; i<this.length; i++) {    
		if(this.substr(0, i).replace(r, "mm").length>=n) {    
	   		return this.substr(0, i) ; }    
	  	} 
  	return this;   
};