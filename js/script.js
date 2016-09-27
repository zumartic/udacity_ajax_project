function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');
	var urlNYT = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
	var urlWiki;
	
    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");
	
	// Wiki selector
	if(document.getElementById('myonoffswitch').checked){
	urlWiki = 'https://en.wikipedia.org/w/api.php?action=opensearch&';
	}else{
		urlWiki = 'https://fi.wikipedia.org/w/api.php?action=opensearch&';
	}

    // load streetview
    // YOUR CODE GOES HERE!
    var streetAddr = $('#street').val();
	var cityName = $('#city').val();
	$greeting.text = "Do you mean? " + streetAddr + "," +cityName
	
	var viewRequest = "https://maps.googleapis.com/maps/api/streetview?size=600x400&location=" +streetAddr + "," +cityName;
	
	// $body.append('<img class="bgimg" src="' + viewRequest +'">');
	$("img").attr( "src", viewRequest );
	
	// Wiki AJAX function

	urlWiki += $.param({
		'search': cityName, 
		'format': "json",
		'callback': "wikiCallback"});
		console.log(urlWiki);
		//'format': "jsonfm"});
		
	var wikiRequestTimeout = setTimeout(function(){
		$wikiElem.text("failed to get wikipedia resources");
	}, 8000);
	
	$.ajax({
		url: urlWiki, 
		dataType: "jsonp",
		success: function( response ){
			var sites = response[1];
			var urls = response[3];
			$.each(sites, function(index, value){
				$("<li class='wikilink'> " + "<a href='" + urls[index] + "'>" + value + "</a></li>").appendTo("#wikipedia-links");				
		   });
		   clearTimeout(wikiRequestTimeout);
	   }
	});

	// NYTimes AJAX function
	urlNYT += '?' + $.param({
		'api-key': "b8a30eb1884d4d4dacf9147fe68a2c6d", 
		'q': cityName,
		'sort': "newest"});
	
	$.getJSON(urlNYT, function(data){
		$.each( data.response.docs, function( key, val ) {
		  $("<li id='" + key + "' class='article'> " + "<a href='" + val.web_url + "'>" + val.headline.main + "</a>" + "<p>" + val.lead_paragraph + "</p></li>").appendTo("#nytimes-articles");
	})
	$nytHeaderElem.text("New York Times Articles about " +cityName);
	}).error(function(err) {
		$nytHeaderElem.text("New York Times Articles Could not be Loaded");
	});

    return false;
};

$('#form-container').submit(loadData);
