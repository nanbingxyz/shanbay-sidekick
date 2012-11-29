chrome.omnibox.onInputChanged.addListener(function(text, suggest) {
	suggest([
		{"content":"+","description":"启用划词翻译"},
		{"content":"@","description":"访问扇贝网"}
	]);
 });


chrome.omnibox.onInputEntered.addListener(function(text) {
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.insertCSS(tab.id,{"file":"stylesheets/omnix.css"},function(){
			chrome.tabs.executeScript(tab.id,{"file":'javascripts/jquery-1.8.3.min.js'},function(){
				chrome.tabs.executeScript(tab.id,{"file":"javascripts/chromebay.js"},function(){
					if(text!="+" && text!="-" && text!="@" && $.trim(text)!=''){
						chrome.tabs.executeScript(tab.id,{"code":'Chromebay.context.word="'+text+'";'},function(){
							chrome.tabs.executeScript(tab.id,{"file":'javascripts/omnix.js'});
						});
					}else{
						if(text=="@"){
							chrome.tabs.create({url:"http://www.shanbay.com"});
						}else{
							chrome.tabs.executeScript(tab.id,{"file":'javascripts/capture.js'});
						}
					}
				});
			});
		})
	});

});


