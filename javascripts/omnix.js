if(chromebay.jqXHR){
	chromebay.jqXHR.abort();
}

if(!$('#chromebay')[0]){
	$(document.body).append(
		'<div id="chromebay" class="chromebay">'+
			'<audio id="chromebay-audio"></audio>'+
			'<div class="head"><span>扇贝Sidekick</span><a href="javascript:void(0)" class="btnClose" title="关闭">[x]</a></div>'+
			'<div class="content"></div>'+
		'</div>'
	);
}else{
	if($('#chromebay').css('left')=='-400px'){
		$('#chromebay').animate({
			left:0
		},1000);
	}
}


$(document.body).click(function(e){
	if($(e.target).parents('#chromebay').get(0) == undefined && $('#chromebay').css('left')=='0px'){
		$('#chromebay').animate({
			left:-400
		},1000);
	}

});

$('#chromebay').mouseover(function(){
	if($('#chromebay').css('left')=='-400px'){
		$('#chromebay').animate({
			left:0
		},1000);
	}
});	

$('.btnClose').click(function(){
	$('#chromebay').remove();
});

$content=$('#chromebay').find('.content');

$content.html('<span>查询 '+chromebay.word+' 中<span id="chromebay-dots1"></span></span>');
chromebay.loadingAnimation('chromebay-dots1');


chromebay.jqXHR = $.ajax({
	url:chromebay.url.query(chromebay.word),
	complete: function(jqXHR, textStatus){
		try{
			var json=$.parseJSON(jqXHR.responseText);
			$content.html(chromebay.render(json));
			$('.chromebay-add').click(function(){
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
			$content.html('<span style="font-size:12px;">发生错误，可能是网络原因导致，请确认<a href="http://www.shanbay.com" target="_blank">扇贝网</a>能正常访问</span>');
		}
		chromebay.clearAnimation();
	}
});

