//If necessary
var user = {
    apiKey: '84d2690223f00a8cc05141e0c91c56b8',
};
var otherUsersArray = [];
var avgRating = null;
// console.log(otherUsersArray);
//CONSTRUCTORS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

/**
 This constructor creates one movie object for the search results
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
        //I think we will need to organize these two on the back end BEFORE they get to here to avoid a lot of extra steps
        avgRating: Math.round(movieObject.rating * 100)/100,
        //then we will have to get these by doing a separate search for their rating?  Seems lengthy.  Too ambitious?
        // otherRatings: movieObject.other_ratings
    };
    // console.log(this.info.otherUsers);
  // getOtherUsers(this.info.movieId);
  // getAvgRating(this.info.movieId);
    //This formats the data to be inserted into the Handlebars template in the HTML
    this.createElements = function() {
        var source = $("#movie-template").html();
        var template = Handlebars.compile(source);
        var context = {
            movieId: this.info.movieId,
            title: this.info.title,
            // link: this.info.link,
            // date: this.info.releaseDate,
            // userRating: this.info.userRating,
            avgRating: this.info.avgRating,
            //Starting to feel like this is a lot of info to jockey around. Unless back end can give us a single node with all the other users and their attached ratings this may be too much
            otherUsers: this.info.otherUsers
            // otherRatings: this.info.other_ratings
        };

        var html = template(context);
        $('.search-result').prepend(html);
    };

    this.createElements();
}
/**
 This constructor creates smaller movie objects for the top twenty
*/
function TopTwenty(movieObject, index) {
    var listNumber = index + 1;
    this.info = {
        title: movieObject.title,
        list: listNumber,
        userRating: movieObject.score,
        // avgRating: movieObject.avg_rating
    };
    //This formats the data to be inserted into the Handlebars template in the HTML.  It's possible we don't really need to use Handlebars here.  The Html for this can exist on load and just the values would be
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
   $.get('http://localhost:9393/api/twenty/movies', function(response) {
     for (var index =0; index<20; index++) {
       new TopTwenty(response[index], index);
     }
   });
 })();


/**
 Search request call
 */
function movieSearch(searchString) {

    $.get('http://localhost:9393/api/get/movie/' + encodeURIComponent(searchString), function(response) {
        $('.search-result').html('');
        return new MovieInfo(response);

    });
}

/**
 This call will return info for the "otherUsers" selected and push for 5 MovieInfo objects to be created
 */
function getOtherUserMovies(userId) {
  $('.top-twenty').html('');
    $.get('http://localhost:9393/api/ratings/top/' + userId, function(response) {
      for (count = 0; count < 5; count++) {
        console.log(response[count]);
        new TopTwenty(response[count], count);
      }
    });
}
// call for average rating given user id
function getAvgRating(userId) {
  $.get('http://localhost:9393/api/ratings/movie/avg/' + userId, function(response) {
    avgRating = response;
  });
}

// This call handles rating functions and links to the deleteRating function
function rateMovie(movieId, userId, score) {
    if (movieRating === 'delete') {
        deleteRating(movieId);
    } else {
      $.post('http://localhost:9393/api/post/ratings/post/' + movieId + '/1700/' + score);
        }
    }


//call to delete user rating
// function deleteRating(movieId) {
//   $.delete('http://localhost:9393/api/post/ratings/post/' + movieId + '/1700');
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

//EVENT DELEGATOR:  OtherUser click
$('.container').on('click', '.users', function(event) {
  var userIdOnClick = $(this).html();
  $('.top-twenty-text').html('User # ' + userIdOnClick + ' Top Five Movies');
    getOtherUserMovies(userIdOnClick);
});

// EVENT DELEGATOR;  Tp twenty to searchString
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
