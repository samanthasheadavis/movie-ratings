//If necessary
var user = {
    apiKey: '84d2690223f00a8cc05141e0c91c56b8',
};

//CONSTRUCTORS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

/**
 This constructor creates one movie object for the search results or when a movie is clicked
*/
function MovieInfo(movieObject) {
  console.log(movieObject);
    if (movieObject === undefined) {
        $('.search-result').html('MOVIE NOT FOUND');
    }
    this.info = {
        movieId: movieObject.movie_info.id,
        title: movieObject.movie_info.title,
        otherUsers: movieObject.top_users.map(function(a) {
          return a.user_id;
        }),
        // linkUrl: movieObject.link,
        // releaseDate: movieObject.release_date,
        // userRating: movieObject.user_rating,
        avgRating: Math.round(movieObject.rating * 100)/100,
        // otherRatings: movieObject.other_ratings
    };

    this.createElements = function() {
        var source = $("#movie-template").html();
        var template = Handlebars.compile(source);
        var context = {
            movieId: this.info.movieId,
            title: this.info.title,
            // link: this.info.link,
            // userRating: this.info.userRating,
            avgRating: this.info.avgRating,
            otherUsers: this.info.otherUsers
            // otherRatings: this.info.other_ratings
        };

        var html = template(context);
        $('.search-result').prepend(html);
    };

    this.createElements();
}

/**
 This constructor creates smaller movie objects for the top twenty and other users movies.
*/
function TopTwenty(movieObject, index) {
    var listNumber = index + 1;
    this.info = {
        title: movieObject.title,
        list: listNumber,
        userRating: movieObject.score,
        // avgRating: movieObject.avg_rating
    };

    this.createElements2 = function() {
        var source = $("#top-twenty-template").html();
        var template = Handlebars.compile(source);
        var context = {
            title: this.info.title,
            list: this.info.list,
            userRating: this.info.userRating,
            avgRating: this.info.avgRating
        };
        var html = template(context);
        $('.top-twenty').append(html);
    };

    this.createElements2();
}


//CALLS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

/**
 Top twenty request call. IIF
 */
 (function() {
   $.get('https://gentle-brushlands-84898.herokuapp.com/api/twenty/movies', function(response) {
     for (var index =0; index<20; index++) {
       new TopTwenty(response[index], index);
     }
   });
 })();


/**
 Search request call
 */
function movieSearch(searchString) {

    $.get('https://gentle-brushlands-84898.herokuapp.com/api/get/movie/' + encodeURIComponent(searchString), function(response) {
        $('.search-result').html('');
        return new MovieInfo(response);
    });
}

/**
Request call for five other movies the selected user has rated
 */
function getOtherUserMovies(userId) {
  $('.top-twenty').html('');
    $.get('https://gentle-brushlands-84898.herokuapp.com/api/ratings/top/' + userId, function(response) {
      for (count = 0; count < 5; count++) {
        console.log(response[count]);
        new TopTwenty(response[count], count);
      }
    });
}

/**
 Call for average rating given user id
 */
function getAvgRating(userId) {
  $.get('https://gentle-brushlands-84898.herokuapp.com/api/ratings/movie/avg/' + userId, function(response) {
    avgRating = response;
  });
}

/**
Call to post ratings given user ID.
*/
// function rateMovie(movieId, userId, score) {
//     if (movieRating === 'delete') {
//         deleteRating(movieId);
//     } else {
//       $.post('https://gentle-brushlands-84898.herokuapp.com/api/post/ratings/post/' + movieId + '/1700/' + score);
//         }
//     }


/**
Call to delete a rating for a given user.
*/ //$.delete('https://gentle-brushlands-84898.herokuapp.com/api/post/ratings/post/' + movieId + '/1700');
//   function(response) {
//         console.log(response);
//     });
// }


//EVENT DELEGATORS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//EVENT DELEGATOR:  Search field/Submit button
$('form').submit(function(event) {
    event.preventDefault();
    var searchString = $('#search-field').val();
    $('#search-field').val('');
    movieSearch(searchString);
});

//EVENT DELEGATOR:  OtherUserMovies click
$('.container').on('click', '.users', function(event) {
  var userIdOnClick = $(this).html();
  $('.top-twenty-text').html('User # ' + userIdOnClick + ' Top Five Movies');
    getOtherUserMovies(userIdOnClick);
});

// EVENT DELEGATOR;  Top twenty to movieSearch
$('.container').on('click', '.movies-container', function(event) {
  var topTwentyOnClick = $(this).find('span').html();
  console.log(topTwentyOnClick);
  movieSearch(topTwentyOnClick);
});

/**
EVENT DELEGATORS:  Drop down ratings box
*/
$('.container').on('change', '.movie-rating', function() {
    var score = $(this).val();
    var movieId = $(this).attr('data-id');
    rateMovie(movieId, score);
    // console.log(movieId, rating);
});
