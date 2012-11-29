Chromebay.context.ctxId = 'chromebay-ominx';
Chromebay.context.cacheEnabled = false;

if(Chromebay.context.jqXHR){
	Chromebay.context.jqXHR.abort();
}

var $container=$('#chromebay-ominx-container');

if(!$container[0]){
	$(document.body).append(
		'<div id="chromebay-ominx-container">'+
			'<audio id="chromebay-audio"></audio>'+
			'<div class="head"><span>扇贝Sidekick</span><a href="javascript:void(0)" class="close" title="关闭">[x]</a></div>'+
			'<div class="content"></div>'+
		'</div>'
	);
	$container=$('#chromebay-ominx-container');
}else{
	if($container.css('left')=='-400px'){
		$container.animate({
			left:0
		},1000);
	}
}


$(document.body).click(function(e){
	Chromebay.context.evnet=e;
	if($(e.target).parents('#chromebay-ominx-container').get(0) == undefined && $container.css('left')=='0px'){
		$container.animate({
			left:-400
		},1000);
	}

});

$container.mouseover(function(){
	if($container.css('left')=='-400px'){
		$container.animate({
			left:0
		},1000);
	}
});	

$container.find('.close').click(function(){
	$container.remove();
});


Chromebay.query(Chromebay.context.word,$container.find('.content'));

