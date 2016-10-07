//If necessary
var user = {
  apiKey: '84d2690223f00a8cc05141e0c91c56b8',
};

//CONSTRUCTORS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

/**
 This constructor creates one movie object for the search results
*/
function MovieInfo(movieObject) {
  this.info = {
    movieId: movieObject.id,
    title: movieObject.title,
    linkUrl: movieObject.link,
    releaseDate: movieObject.release_date,
    userRating: movieObject.user_rating,
    //I think we will need to organize these two on the back end BEFORE they get to here to avoid a lot of extra steps
    avgRating: movieObject.avg_rating,
    otherUsers: movieObject.other_users,
    //then we will have to get these by doing a separate search for their rating?  Seems lengthy.  Too ambitious?
    otherRatings: movieObject.other_ratings
  };
//This formats the data to be inserted into the Handlebars template in the HTML
  this.createElements = function() {
    var source = $("#movie-template").html();
    var template = Handlebars.compile(source);
    var context = {
      movieId: this.info.movieId,
      title: this.info.title,
      link: this.info.link,
      date: this.info.releaseDate,
      userRating: this.info.userRating,
      avgRating: this.info.avgRating,
      //Starting to feel like this is a lot of info to jockey around. Unless back end can give us a single node with all the other users and their attached ratings this may be too much
      otherUsers: this.info.other_users,
      otherRatings: this.info.other_ratings
    };
    var html = template(context);
    $('.content').prepend(html);
  };

  this.createElements();
}
/**
 This constructor creates smaller movie objects for the top twenty
*/
function TopTwenty(movieObject) {
  this.info = {
    title: movieObject.title,
    userRating: movieObject.user_rating,
    avgRating: movieObject.avg_rating,
  };
//This formats the data to be inserted into the Handlebars template in the HTML.  It's possible we don't really need to use Handlebars here.  The Html for this can exist on load and just the values would be
  this.createElements2 = function() {
    var source = $("#movie-template").html();
    var template = Handlebars.compile(source);
    var context = {
      title: this.info.title,
      userRating: this.info.userRating,
      avgRating: this.info.avgRating,
    };
    var html = template(context);
    $('.content').prepend(html);
  };

  this.createElements2();
}


//CALLS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

/**
 Top twenty request call
 */
(function() {
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://api.themoviedb.org/3/search/movie?query=&api_key=" + user.apiKey,
    "method": "GET",
    "processData": false,
    "data": "{}"
  };

  $.ajax(settings).done(function(response) {
    // NOT sure this is the function we will actually need but something will have to tell it to make 20 copies.  But how are we gonna determine what the top twenty are? There will have to be an evaluation before this is sent to the constructor.
    for (var index = 0; index < 20; index++) {
      new TopTwenty(response.results[index]);
    }
  });
})();


/**
 Search request call
 */
function movieSearch(searchString) {
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://api.themoviedb.org/3/search/movie?query=" + encodeURIComponent(searchString) + "&api_key=" + user.apiKey,
    "method": "GET",
    "processData": false,
    "data": "{}"
  };

  $.ajax(settings).done(function(response) {
    return new MovieInfo(response.results[0]);
  });
}

/**
 This call will return info for the "otherUsers" selected and push for 5 MovieInfo objects to be created
 */
function otherUserMovies(userId) {
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://api.themoviedb.org/3/movie/" + encodeURIComponent(userId) + "/similar?api_key=" + user.apiKey,
    "method": "GET",
    "processData": false,
    "data": "{}"
  };

  $.ajax(settings).done(function(response) {
    $('.content').html('');
    for (var index = 0; index < 5; index++) {
      new MovieInfo(response.results[index]);
    }
  });
}

//This call handles rating functions and links to the deleteRating function
function rateMovie(movieId, movieRating) {
  if (movieRating === 'delete') {
    deleteRating(movieId);
  } else {
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://api.themoviedb.org/3/movie/" + movieId + "/rating?session_id=" + user.session + "&api_key=" + user.apiKey,
      "method": "POST",
      "headers": {
        "content-type": "application/json;charset=utf-8"
      },
      "processData": false,
      "data": "{\n  \"value\": " + movieRating + "\n}"
    };

    $.ajax(settings).done(function(response) {
      console.log(response);
    });
  }
}

//call to delete user rating
function deleteRating(movieId) {
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://api.themoviedb.org/3/movie/" + movieId + "/rating?session_id=" + user.session + "&api_key=" + user.apiKey,
    "method": "DELETE",
    "headers": {
      "content-type": "application/json;charset=utf-8"
    },
    "processData": false,
    "data": "{}"
  };

  $.ajax(settings).done(function(response) {
    console.log(response);
  });
}


//EVENT DELEGATORS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//EVENT DELEGATOR:  Search field/Submit button
$('form').submit(function(event) {
  event.preventDefault();
  var searchString = $('#search-field').val();
  $('#search-field').val('');
  movieSearch(searchString);
});

//EVENT DELEGATOR:  OtherUser click
$('.contaner').on('click', '.otherUsers', function(event) {
//some way here of getting the user id from the user name clicked.  there may need to be five of these, a unique one for each possible choice
  otherUserMovies(userId);
});

/**
 EVENT DELEGATOR:  Close Button
 */
$('.container').on('click', '.close', function(event) {
  $(this).parents('.movie-container').slideUp(function() {
    $(this).remove();
  });
});

/**
EVENT DELEGATORS:  Drop down ratings box
*/
$('.container').on('change', '.movie-rating', function() {
  var rating = $(this).val();
  var movieId = $(this).attr('data-id');
  rateMovie(movieId, rating);
});
