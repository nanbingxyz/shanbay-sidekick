chrome.omnibox.onInputChanged.addListener(function(text, suggest) {
    suggest([
    	{content: text + " one", description: "the first one"},
    	{content: text + " number two", description: "the second entry"}
    ]);
 });

// This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener(function(text) {

	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.insertCSS(tab.id,{"file":"stylesheets/omnix.css"},function(){
			chrome.tabs.executeScript(tab.id,{"file":'javascripts/jquery-1.8.3.min.js'},function(){
				chrome.tabs.executeScript(tab.id,{"file":"javascripts/chromebay.js"},function(){
					chrome.tabs.executeScript(tab.id,{"code":'chromebay.word="'+text+'";'},function(){
						chrome.tabs.executeScript(tab.id,{"file":'javascripts/omnix.js'});
					});
				});
			});
		})
	});

});


