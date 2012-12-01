Chromebay.context.ctxId = 'chromebay-ominx';
Chromebay.context.cacheEnabled = false;

if(Chromebay.context.jqXHR){
	Chromebay.context.jqXHR.abort();
}

var $container=$('#chromebay-ominx-container');

if(!$container[0]){
	$(document.body).append(
		'<div id="chromebay-ominx-container">'+
			'<div style="position:relative">'+
			'<a href="javascript:void(0)" class="close" style="position:absolute;top:5px;right:10px;" title="关闭">x</a>'+
			'<div class="content"></div>'+
			'<div id="chromebay-ominx-separator">'+
			'<img src="'+chrome.extension.getURL('images/collapse.png')+'" width="33" height="67"/>'+
			'</div>'+
			'</div>'+
		'</div>'
	);
	$container=$('#chromebay-ominx-container');
}else{
	if($container.css('left')=='-400px'){
		$container.animate({
			left:0
		},1000).find('#chromebay-ominx-separator img').attr('src',chrome.extension.getURL('images/collapse.png'));
	}
}


$(document.body).click(function(e){
	Chromebay.context.evnet=e;
	if($(e.target).parents('#chromebay-ominx-container').get(0) == undefined && $container.css('left')=='0px'){
		$container.animate({
			left:-400
		},1000).find('#chromebay-ominx-separator img').attr('src',chrome.extension.getURL('images/expande.png'));
	}

});

$container.mouseover(function(){
	if($container.css('left')=='-400px'){
		$container.animate({
			left:0
		},1000).find('#chromebay-ominx-separator img').attr('src',chrome.extension.getURL('images/collapse.png'));
	}
});	

$container.find('.close').click(function(){
	$container.remove();
});


Chromebay.query(Chromebay.context.word,$container.find('.content'));

