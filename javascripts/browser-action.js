Chromebay.autocomplete={
	source:function(rs){
		var result=[];
		for(var i=0;i<rs.rows.length;i++){
			var word=rs.rows.item(i)['word'];
			var definition=rs.rows.item(i)['definition'];
			result.push({"value":word,"definition":definition});
		}
		return result;
	},
	enable:function(){
		Chromebay.webdb.queryHistory(
			function(tx,rs){
				var words=Chromebay.autocomplete.source(rs);
				$('input[name="word"]').autocomplete({
					source: words,
					minLength:0,
					select: function(event, ui) {
						$('input[name="word"]').val(ui.item.value);
					    doQuery(ui.item.value);
					    return false;
					}
				}).data( "autocomplete" )._renderItem = function( ul, item ) {
		            return $( '<li title="'+item.definition+'" >' )
		                .data( "item.autocomplete", item )
		                .append( '<a href="javascript:void(0)"><span class="word">'+item.value+'</span><span class="definition">'+item.definition.sub(40)+'</span></a>' )
		                .appendTo(ul);
				};
			}
		);
	},
	refreshSource:function(){
		if($('input[name="word"]').autocomplete){
			Chromebay.webdb.queryHistory(
				function(tx,rs){
					$('input[name="word"]').autocomplete('option','source',Chromebay.autocomplete.source(rs));
				}
			);
		}
	}
}

function toggleBtnStatus(loading){
	if(loading){
		$('#chromebay-imgQuery').hide('fast',function(){
			$('#chromebay-imgQuerying').show();
		});
	}else{
		$('#chromebay-imgQuerying').hide('fast',function(){
			$('#chromebay-imgQuery').show();
		});
	}
}


function onQueryComplete($container,json){
	toggleBtnStatus(false);
	$('input[name="word"]').val('');
}

function onQueryError(e,jqXHR,responseText){
	toggleBtnStatus(false);
}

function doQuery(word){
	Chromebay.context.ctxId = 'chromebay';
	Chromebay.query(
		word || $('input[name="word"]').val(),
		$('#chromebay-content'),
		function(){
			toggleBtnStatus(true);
			Chromebay.context.$('.cancel').click(function(e){
				Chromebay.context.event=e;
				if(Chromebay.context.jqXHR){
				Chromebay.context.jqXHRCanceled=true;
				Chromebay.context.jqXHR.abort();
				toggleBtnStatus(false);
				$('#chromebay-content').html("");
				}
			});
		},
		onQueryComplete,
		onQueryError
	)
}

$(function(){
	var $wordInput=$('input[name="word"]');
	Chromebay.autocomplete.enable();
	$wordInput[0].focus();
	
	$wordInput.keyup(function(e){
		Chromebay.context.event=e;
		if(e.which == 13 ){
			doQuery();
		}
	});

	$('#chromebay-btnQuery').click(function(){
		Chromebay.context.event=e;
		doQuery();
	});
});