console.clear();
/**
Define API Key to gain access to the movie database
*/
var user = {
  apiKey: '84d2690223f00a8cc05141e0c91c56b8',
  requestToken: null,
  session: null,
  validSession: false
};





/**
 Create a function to send the base search request, sending the results to the movie details constructor
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
    return new MovieDetails(response.results[0]);
  });

}

/**
 Create a constructor that will build our movie details previews
*/
function MovieDetails(movieObject) {
  console.log(movieObject);
  this.info = {
    movieId: movieObject.id,
    title: movieObject.title,
    overview: movieObject.overview,
    poster: 'https://image.tmdb.org/t/p/w185_and_h278_bestv2' + movieObject.poster_path
  };

  this.createElements = function() {
    var source = $("#movie-template").html();
    var template = Handlebars.compile(source);
    var context = {
      movieId: this.info.movieId,
      title: this.info.title,
      image: this.info.poster,
      overview: this.info.overview
    };
    var html = template(context);
    $('.content').prepend(html);
  };

  this.createElements();
}


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

/**
 Handle the form submit, preventing the default behavior and formatting the search string
 */
$('form').submit(function(event) {
  event.preventDefault();
  var searchString = $('#search-field').val();
  $('#search-field').val('');
  movieSearch(searchString);
});

/**
 Use event delegation to assign click events to the close icons
 */
$('.container').on('click', '.close', function(event) {
  $(this).parents('.movie-container').slideUp(function() {
    $(this).remove();
  });
});



/**
Use event delegation to link to drop down to the rate function
*/
$('.container').on('change', '.movie-rating', function() {
  var rating = $(this).val();
  var movieId = $(this).attr('data-id');
  rateMovie(movieId, rating);
});
