$(function(){
	var $wordInput=$('input[name="word"]');

	chromebay.autocomplete.enable();

	$wordInput[0].focus();

	

	$wordInput.keyup(function(e){
		if(e.which == 13 ){
			chromebay.query();
		}
	});

	$('#chromebay-btnQuery').click(function(){
		chromebay.query();
	});

	$('#chromebay-cancel').live('click',function(){
		if(chromebay.jqXHR){
			chromebay.jqXHRCanceled=true;
			chromebay.jqXHR.abort();
			chromebay.toggleQueryBtn(false);
			$('#chromebay-content').html("");
		}
	});
});
