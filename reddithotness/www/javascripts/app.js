var app = (function() {
	
	var reddit_base = "http://reddit.com",
		pub = {},
		twitterIsSetup = false;
	
	pub.hasTwitter = false,
	
	pub.tmp = new kendo.data.DataSource({
		transport: {
			read: "test.json"
		},
		schema: {
			data: "data.children",
			fields: {
				title: "data.title",
				url: "data.url",
				points: "data.score"
			}
		},
		sort: { field: "data.score", dir: "desc" }
	});

	pub.reddit = new kendo.data.DataSource({
		transport: {
			read: {
				url: function(operation) {
				    return "http://reddit.com" + operation.reddit + ".json" 
				}
			},
			parameterMap: function(operation, type) {
			    return operation.reddit = operation.reddit || "/r/programming";
			}
		},
		schema: {
			data: "data.children",
			fields: {
				title: "data.title",
				url: "data.url",
				score: "data.score"
			}
		},
		sort: { field: "data.score", dir: "desc" }
	});
	
	pub.reddits = new kendo.data.DataSource({
		transport: {
			read: "http://reddit.com/reddits.json"
		},
		schema: {
			data: "data.children",
			model: {
			    id: "uid",
			    fields: {
				    name: "data.display_name",
    				url: reddit_base + "data.url" + ".json",
    				title: "title"
				}
			}
		}
	})

	composeTweet = function(text, url) {
		
	}

	pub.init = function() {
		// determine if twitter is supported before loading app
		try {
            window.plugins.twitter.isTwitterAvailable(function(r){
                pub.hasTwitter = true;
                init();
     	    });
 	    }
		catch(err) {
		    init();
		}
	}
	
	init = function() {
		// create the kendo ui mobile application
		kendo_app = new kendo.mobile.Application();
		
		var app_viewModel = kendo.observable({
		   title: "Programming" 
		});
		
		// kendo.bind($("#the_app"), app_viewModel);
		
		/*$("#select-a-reddit").kendoMobileListView({
			dataSource: reddits,
			template: "${name}",
			style: "inset"
		});*/	
		
		$("#popular_news").on("click", ".story-link", function(e) {
			var url = $(e.currentTarget).data("url");
			var cb = ChildBrowser.install();
			if(cb != null)
				window.plugins.childBrowser.showWebPage(url);
		});
           
        $("#popular_news").on("click", ".tweet-button", function(e) {
            var title = $(e.currentTarget).data("title"),
            url = $(e.currentTarget).data("url")

            // is twitter setup? If not, tell the user to go do it	
            window.plugins.twitter.isTwitterSetup(function(r) {
                if (r === 1) {
                    // twitter is setup, compose a new tweet
                    window.plugins.twitter.composeTweet(
                        function(s) {},
                        function(e) {
                            if ($(e).trim().toLower() !== "canceled") {
                                alert("Failed sending Tweet..." + e);
                            }
                        },
                        title, {
                        urlAttach: url
                        }
                    );
                }
                else {
                    navigator.notification.alert("Please setup Twitter under Settings to use this feature", 
                    null, "No Twitter :(");	
                }
            });

            e.preventDefault();
        });
        
        $("#select_reddit").on("click", ".select-reddit", function(e) {
            var url = $(e.currentTarget).data("url");
            pub.reddit.read(url);
        });
	}

	return pub;
	
})();