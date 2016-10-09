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
        movieId: movieObject.id,
        title: movieObject.title,
        otherUsers: otherUsersArray,
        // linkUrl: movieObject.link,
        // releaseDate: movieObject.release_date,
        // userRating: movieObject.user_rating,
        //I think we will need to organize these two on the back end BEFORE they get to here to avoid a lot of extra steps
        // avgRating: movieObject.vote_average,
        //then we will have to get these by doing a separate search for their rating?  Seems lengthy.  Too ambitious?
        // otherRatings: movieObject.other_ratings
    };
    // console.log(this.info.otherUsers);
  getOtherUsers(this.info.movieId);
  getAvgRating(this.info.movieId);
console.log(avgRating);
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
            avgRating: avgRating,
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
 Top twenty request call
 */
 (function() {
   $.get('http://localhost:9393/api/twenty/movies', function(response) {
     console.log(response);
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


//This is the call for five users who have also rated this movie
function getOtherUsers(movieId) {
    $.get('http://localhost:9393/api/ratings/top/five/' + movieId, function(response) {
        for (count = 0; count < 5; count++) {
            otherUsersArray.push(response[count].id);
        }
    });
}

/**
 This call will return info for the "otherUsers" selected and push for 5 MovieInfo objects to be created
 */
function getOtherUserMovies(userId) {
    $.get('http://localhost:9393/api/ratings/top/' + userId, function(response) {
      for (count = 0; count < 5; count++) {
        new TopTwenty(response[count]);
      }
    });
}
// call for average rating given user id
function getAvgRating(userId) {
  $.get('http://localhost:9393/api/ratings/movie/avg/' + userId, function(response) {
    avgRating = response;
  });
}
//This call handles rating functions and links to the deleteRating function
function rateMovie(movieId, movieRating) {
    if (movieRating === 'delete') {
        deleteRating(movieId);
    } else {
      $.post('http://localhost:9393/api/post/ratings/post');
        }
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
$('.container').on('click', '.otherUsers', function(event) {
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
