Chromebay.context.ctxId = 'chromebay-capture';
Chromebay.context.cacheEnabled = false;

var chromebayCapture={

	$container:function(){
		return $('#chromebay-capture-container');
	},
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
	show:function(e){
		var el = document.getElementById('chromebay-capture-container');
		if(!el){
			el=document.createElement('div');
			el.id='chromebay-capture-container';
			el.style.width="330px";
			el.style.minHeigt="60px";
			el.style.MozBorderRadius ='5px';
			el.style.WebkitBorderRadius='5px'
			el.style.border="1px solid #ccc";
			el.style.background="#fafafa";
			el.style.position='absolute';
			el.style.zIndex="9999999";
			el.style.boxShadow='0 1px 3px rgba(0, 0, 0, 0.3)';
			el.style.MozBoxShadow='0 1px 3px rgba(0, 0, 0, 0.3)';
			el.style.WebkitBoxShadow='0 1px 3px rgba(0, 0, 0, 0.3)';
			document.body.appendChild(el);
		}
		var pos = chromebayCapture.mouseCoords(e);
		el.style.top=(pos.y+10)+'px';
		el.style.left=(pos.x-40)+'px';
		el.style.display="block";
	},
	query:function(e){
		if(Chromebay.context.jqXHR){
			Chromebay.context.jqXHR.abort();
		}
		var word=$.trim(chromebayCapture.getText());
		if(word==""||word.length>80){
			chromebayCapture.$container().hide();
			return;
		}
		chromebayCapture.show(e);
		chromebayCapture.$container().html(
			'<div style="position:relative;" >'+
				'<a href="javascript:void(0);" style="position:absolute;top:7px;right:10px;" class="close" title="关闭">x</a>'+
				'<div style="padding:12px" class="content">'+
				'</div>'+
			'</div>'
		);
		Chromebay.query(word,$('#chromebay-capture-container .content'));
	}
}

$(function(){
	document.body.onmouseup=function(e){
		if(e.target.className=="close"||e.target.className=="cancel"){
			if(Chromebay.context.jqXHR){
				Chromebay.context.jqXHR.abort();
			}
			chromebayCapture.$container().hide();
		}else if($(e.target).parents('#chromebay-capture-container')[0] || $(e.target).parents('#chromebay-ominx-container')[0]){
			return;
		}else{
			chromebayCapture.query(e);
		}
		return false;
	};
});