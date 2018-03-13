/*
  Please add all Javascript code to this file.
*/

$(document).ready(function () {
  // LOAD INITIAL ARTICLES
  allSources();

  // LOAD NEW ARTICLES ON SOURCE SELECTION
  $('#source-list a').click(function () {
    if($(this).hasClass('espn')) {
      espn();
    } else if ($(this).hasClass('fox-sports')) {
      foxSports();
    } else if ($(this).hasClass('bbc-sport')) {
      bbcSport();
    }
  });

  $('#home-link').click(function () {
    allSources();
  });

  $('body').on('click', 'article', function () {
    var title = $(this).children('.source-title')[0].innerText;
    var summary = $(this).children('summary')[0].innerText;
    var link = $(this).children('a.source-link')[0].href;
    showPopup(title, summary, link);
  });

  $('.closePopUp').click(function () {
    hidePopup(true);
  });

  $('#search a').click(function() {
    $('#search').toggleClass('active');
  });
})

// LOAD ALL SOURCES ARTICLES
function allSources() {
  var source = 'All Sources',
      url = 'https://newsapi.org/v2/top-headlines?' +
            'sources=espn,fox-sports,bbc-sport&' +
            'apiKey=6d3f1888cd1a41ab91f7cdfdebb1ab1e';

  news(source, url);  
}

// LOAD ESPN ARTICLES
function espn() {
  var source = 'ESPN',
      url = 'https://newsapi.org/v2/top-headlines?' +
            'sources=espn&' +
            'apiKey=6d3f1888cd1a41ab91f7cdfdebb1ab1e';

  news(source, url); 
}

// LOAD FOX SPORTS ARTICLES
function foxSports() {
  var source = 'Fox Sports',
      url = 'https://newsapi.org/v2/top-headlines?' +
            'sources=fox-sports&' +
            'apiKey=6d3f1888cd1a41ab91f7cdfdebb1ab1e';

  news(source, url);
}
// LOAD BBC SPORT ARTICLES
function bbcSport() {
  var source = 'BBC Sport',
  url = 'https://newsapi.org/v2/top-headlines?' +
        'sources=bbc-sport&' +
        'apiKey=6d3f1888cd1a41ab91f7cdfdebb1ab1e';

  news(source, url);
}

/// /////////////////////////////////
///  RETRIEVE SOURCES
/// /////////////////////////////////

function news(source, url) {
  $('#popUp').addClass('loader').removeClass('hidden');
  $('article').remove();

  var results = [];
  $.ajax({
    url: url,
    method: 'GET'
  }).success(function (result) {
    var articles = result.articles;
    for(var i in articles) {
      var thisArticle = articles[i],
          date = thisArticle["publishedAt"].split('T')[0]
      if(thisArticle["title"] != "") {
        results.push({
          title: thisArticle["title"],
          content: thisArticle["description"],
          link: thisArticle["url"],
          imageSource: thisArticle["urlToImage"],
          category: thisArticle["source"]["name"],
          date: date
        });
      }
    }
    for(var i in results) {
      buildArticle(results[i]);
    }
    $('#current-source').text(source);
    hidePopup(true);
  }).fail(function (err) {
    error(source);
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
    data["date"] +
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
  }
}

function showPopup(articleTitle, summaryText, articleUrl) {
  $('#popUp').addClass('loader').removeClass('hidden');
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

