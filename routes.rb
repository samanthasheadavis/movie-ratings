require 'sinatra'
require 'active_record'
require_relative 'movie'
require_relative 'rating'
require_relative 'environment'
require "sinatra/cross_origin"

register Sinatra::CrossOrigin

configure do
  enable :cross_origin
end

before do
  content_type :json
end

options '/*' do
  response["Access-Control-Allow-Headers"] = "origin, x-requested-with, content-type"
end

#post movie with title !!!WORKING!!!
post '/api/movies/title' do
  movie = Movie.new(title: params[:title])
   if movie.valid? && movie.save
     status 201
     movie.to_json
   else
     status 400
  end
end

#get movie by title  !!!WORKING!!!
get '/api/get/movie/:title' do |title|
  movie = Movie.where(["title LIKE ?", "%#{params[:title]}%"])
  movie.to_json
end

#20 movies !!!WORKING!!!
get '/api/twenty/movies' do
  movie = Movie.order.limit(20)
  movie.to_json
end

#delete movie by title  !!!WORKING!!!
delete '/api/delete/movie/:title' do |title|
  movie = Movie.find_by(title: title)
  movie.destroy
  nil
end

#post rating through user with movie_id>>movie.id(title) !!!WORKING!!!
post '/api/post/ratings/post' do
  rating = Rating.new(movie_id: params[:movie_id], user_id: params[:user_id], score: params[:score])
  if rating.valid? && rating.save
    status 201
    rating.to_json
  else
    status 400
  end
end

#get all ratings for user_id !!!WORKING!!!
get '/api/ratings/of/user/:user_id' do |user_id|
 ratings = Rating.all.where(user_id: user_id)
 ratings.to_json
end

#get all ratings for user_id where rating is 5 !!!WORKING!!!
get '/api/ratings/top/:user_id' do |user_id|
 ratings = Rating.all.where(user_id: user_id).where(score: 5)
 ratings.to_json
end

#get 5, 5 star ratings for movie_id !!!WORKING!!!
get '/api/ratings/top/five/:movie_id' do |movie_id|
 ratings = Rating.all.where(movie_id: movie_id).where(score: 5).limit(5)
 ratings.to_json
end

#get rating average for movie_id !!!WORKING!!!
get '/api/ratings/movie/avg/:movie_id' do |movie_id|
 ratings = Rating.select(:score).where(movie_id: movie_id).average(:score)
 ratings.to_json
end

#delete all reviews from user !!!PROBS WORKING NOT GONNA TEST LOL!!!
delete '/api/ratings/delete/:user_id' do |user_id|
  ratings = Rating.all.where(user_id: user_id)
  ratings.destroy
  nil
end
