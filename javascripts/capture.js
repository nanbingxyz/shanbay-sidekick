var chromebayCapture={

	getText:function(){
		if (window.getSelection) return window.getSelection();
		else if (document.getSelection) return document.getSelection();
		else if (document.selection) return document.selection.createRange().text;
		else return '';
	},
	isInteger:function(s){
		return (s.toString().search(/^-?[0-9]+$/) == 0);
	},
	mouseCoords:function(e){
		var x=0,y=0;
		try{
			x = e.clientX + window.scrollX;
	    	y = e.clientY + window.scrollY;
		}catch(ex){console.error(ex)};
	  	if(!chromebayCapture.isInteger(x)) x = 200;
	  	if(!chromebayCapture.isInteger(y)) y = 200;
	  	return {'x':x,'y':y};
	},
	ajax:function(e,word){
		chromebay.word=word;
		chromebay.jqXHR = $.ajax({
			url:chromebay.url.query(chromebay.word),
			complete: function(jqXHR, textStatus){
				try{
					var json=$.parseJSON(jqXHR.responseText);
					$('#chromebay-capture').html(
						'<div style="position:relative;" >'+
							'<a href="javascript:void(0);" style="position:absolute;top:7px;right:10px;" id="chromebay-close-2" title="关闭">x</a>'+
							'<div style="padding:12px">'+
								chromebay.render(json)+
							'</div>'+
						'</div>'
					);

					$('#chromebay-add').click(function(){
						$(this).fadeOut('fast',function(){
							$('#chromebay-add-status').fadeIn('fast',function(){
								chromebay.loadingAnimation('chromebay-dots3');
								chromebay.addWord(json.voc.content);
							});
						});
					});
					if(json.learning_id>0){
						chromebay.loadExamples(json.learning_id);
					}
					$('.icon-volume-up').click(function(){
						chromebay.playMP3(json.voc.audio);
					});
				}catch(e){
					$('#chromebay-capture').html('<div style="padding:12px"><span>发生错误，可能是网络原因导致，请确认<a href="http://www.shanbay.com" target="_blank">扇贝网</a>能正常访问</span></div>');
				}
				chromebay.clearAnimation();
			}
		});
	},
	show:function(e){
		var el = document.getElementById('chromebay-capture');
		if(!el){
			el=document.createElement('div');
			el.id='chromebay-capture';
			el.className="chromebay";
			el.style.width="330px";
			el.style.MozBorderRadius ='5px';
			el.style.WebkitBorderRadius='5px'
			el.style.border="1px solid #ccc";
			el.style.background="#fff";
			el.style.position='absolute';
			el.style.boxShadow='0 1px 3px rgba(0, 0, 0, 0.3)';
			el.style.MozBoxShadow='0 1px 3px rgba(0, 0, 0, 0.3)';
			el.style.WebkitBoxShadow='0 1px 3px rgba(0, 0, 0, 0.3)';
			document.body.appendChild(el);
			$('#chromebay-cancel-2').click(function(e){
				if(chromebay.jqXHR)chromebay.jqXHR.abort();
				$('#chromebay-capture').hide();
			});
		}
		var pos = chromebayCapture.mouseCoords(e);
		el.style.top=(pos.y+10)+'px';
		el.style.left=(pos.x-40)+'px';
		el.style.display="block";
		el.innerHTML='<div style="padding:12px"><a href="javascript(0)" id="chromebay-cancel-2">取消</a>&nbsp;&nbsp;<span>正在查询中<span id="loading-dots4"></span></span></div>';
		chromebay.loadingAnimation('loading-dots4');
	},
	query:function(e){
		if(chromebay.jqXHR){
			chromebay.jqXHR.abort();
		}
		var word=$.trim(chromebayCapture.getText());
		if(word==""||word.length>80){
			$('#chromebay-capture').hide();
			return;
		}
		chromebayCapture.show(e);
		chromebayCapture.ajax(e,word);
	}
}

$(function(){
	document.body.onmouseup=function(e){
		if(e.target.id=="chromebay-close-2"||e.target.id=="chromebay-cancel-2"||e.target.id=="btnClose"){
			if(chromebay.jqXHR){
				chromebay.jqXHR.abort();
			}
			$('#chromebay-capture').hide();
		}else if($(e.target).parents('#chromebay-capture')[0]|| $(e.target).parents('#chromebay')[0]){
			return;
		}else{
			chromebayCapture.query(e);
		}
		return false;
	};
})