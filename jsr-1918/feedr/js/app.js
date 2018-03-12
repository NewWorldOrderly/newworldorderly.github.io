/*
  Please add all Javascript code to this file.
*/

$(document).ready(function () {

  // LOAD INITIAL ARTICLES
  newYorkTimes();

  // LOAD NEW ARTICLES ON SOURCE SELECTION
  $('#source-list a').click(function () {
    if($(this).hasClass('new-york-times')) {
      newYorkTimes();
    } else if ($(this).hasClass('bbc-news')) {
      bbcNews();
  	}
  });

  $('.closePopUp').click(function () {
    hidePopup(true);
  });

  $('#search a').click(function() {
    $('#search').toggleClass('active');
  });
})

/// /////////////////////////////////
///  Source: NY Times
/// /////////////////////////////////

function newYorkTimes() {
  $('#popUp').addClass('loader').removeClass('hidden');
  $('article').remove();
  var url = "https://api.nytimes.com/svc/topstories/v2/home.json";
  url += '?' + $.param({'api-key': "3d880d5967c649b595beb5e5eaba12ae"});
  var results = [];
  $.ajax({
    url: url,
    method: 'GET'
  }).success(function (result) {
    var articles = result["results"];
    for (i = 0; i < articles.length; i++) {
      results.push({
        title: articles[i]["title"],
        content: articles[i]["abstract"],
        link: articles[i]["url"],
        imageSource: getNytImage(articles[i]["multimedia"]),
        category: getNytCategory(articles[i]),
        length: articles[i]["abstract"].length
      });
    };
    for (i = 0; i < results.length; i++) {
      buildArticle(results[i]);
    }
    hidePopup(true);
  }).fail(function (err) {
    error("the New York Times");
    console.log(err);
  });
  return results;

  // Get a thumbnail image from a NYT multimedia object
  function getNytImage(mediaObj) {
    var img = "";
    if(mediaObj.length == 0) {
      img = "images/no.png"
    } else {
      img = mediaObj.find(function (obj) {
        return obj["format"] == "Standard Thumbnail";
      }).url;
    }
    return img;
  }

  // Get the category
  function getNytCategory(resultObj) {
    var category = resultObj["section"];
    if (resultObj["subsection"].length > 0) {
      category += " - " + resultObj["subsection"];
    }
    return category;
  }
}

/// /////////////////////////////////
///  Source: BBC News 
/// /////////////////////////////////

function bbcNews() {
  $('#popUp').addClass('loader').removeClass('hidden');
  $('article').remove();
  var url = "https://newsapi.org/v2/top-headlines";
  url += '?' + $.param({'sources': 'bbc-news'});
  url += '&' + $.param({'apiKey': '6d3f1888cd1a41ab91f7cdfdebb1ab1e'});
  var results = [];
  $.ajax({
    url: url,
    method: 'GET'
  }).success(function (result) {
    var articles = result.articles;
    for(var i in articles) {
      thisArticle = articles[i];
      results.push({
        title: thisArticle["title"],
        content: thisArticle["description"],
        link: thisArticle["url"],
        imageSource: thisArticle["urlToImage"],
        category: "BBC News",
        //length: thisArticle[i]["description"].length
      });
      for(var i in results) {
        buildArticle(results[i]);
      }
    }
    hidePopup(true);
  }).fail(function (err) {
    error("the Economist");
    console.log(err);
  });
  return results;
}

// Build Articles
function buildArticle(data) {
  var articleSec = '<article class="article">' +
    '<section class="featuredImage">' +
    '<img src="'+data.imageSource+'" alt="" />' +
    '</section>' +
    '<section class="articleContent">' +
    '<a href="#"><h3>'+data.title+'</h3></a>' +
    '<h6>'+ data.category +'</h6>' +
    '</section>' +
    '<section class="impressions">' +
    data["length"] +
    '</section>' +
    '<div class="hidden source-title">'+data.title+'</div>'+
    '<summary class="hidden">'+data.content+'</summary>' +
    '<a class="hidden source-link" href="'+data.link+'">'+data.link+'</a>' +
    '<div class="clearfix"></div>' +
    '</article>';
  $('#main').append(articleSec);
}

function hidePopup(removePopUp) {
  removePopUp = removePopUp || false;
  $('#popUp').removeClass('loader');
  if(removePopUp) {
    $('#popUp').addClass('hidden');

    $('article').click(function () {
      var title = $(this).children('.source-title')[0].innerText;
      var summary = $(this).children('summary')[0].innerText;
      var link = $(this).children('a.source-link')[0].href;
      showPopup(title, summary, link);
    });
  }
}

function showPopup(articleTitle, summaryText, articleUrl) {
  loading();
  $('#popUp h1')[0].innerText = articleTitle;
  $('#popUp .container p')[0].innerText = summaryText;
  $('.popUpAction').attr('href', articleUrl);
  hidePopup();
}

function error(sourceName) {
  hidePopup(true);
  var $errDiv = $('#main .error');
  $errDiv.removeClass('hidden');
  if(sourceName.length > 0) {
    $errDiv.children('.the-source')[0].innerText = sourceName;
  } else {
    $errDiv.children('.the-source')[0].innerText = 'the source';
  }
  $('a').click(function() {
    $errDiv.addClass('hidden');
  });
  console.log(sourceName);
}

