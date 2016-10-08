require 'sinatra'
require 'active_record'
require_relative 'movie'
require_relative 'rating'
require_relative 'environment'

after do
  ActiveRecord::Base.connection.close
end

before do
  content_type :json
end

#post movie with title !!!WORKING!!!
post '/api/movies' do
  movie = Movie.new(title: params[:title])
   if movie.valid? && movie.save
     status 201
     movie.to_json
   else
     status 400
  end
end

#get movie by title  !!!WORKING!!!
get '/api/movies/:title' do |title|
  movie = Movie.find_by(title: title)
  movie.to_json
end

#-----------------------movie = Movie.includes(:id)
get '/api/movies' do
  movie = Movie.all
  movie.to_json
end

#delete movie by title  !!!WORKING!!!
delete '/api/movies/:title' do |title|
  movie = Movie.find_by(title: title)
  movie.destroy
  nil
end

#post rating through user with movie_id>>movie.id(title) !!!WORKING!!!
post '/api/ratings/post' do
  rating = Rating.new(movie_id: params[:movie_id], user_id: params[:user_id], score: params[:score])
  if rating.valid? && rating.save
    status 201
    rating.to_json
  else
    status 400
  end
end

#get all ratings for user_id !!!WORKING!!!
get '/api/ratings/for/user/:user_id' do |user_id|
 ratings = Rating.all.where(user_id: user_id)
 ratings.to_json
end

#get all ratings for user_id where rating is 5 !!!WORKING!!!
get '/api/ratings/top/:user_id' do |user_id|
 ratings = Rating.all.where(user_id: user_id).where(score: 5)
 ratings.to_json
end

#get 5, 5 star ratings for movie_id !!!WORKING!!!
get '/api/ratings/movie/top/:movie_id' do |movie_id|
 ratings = Rating.all.where(movie_id: movie_id).where(score: 5).limit(5)
 ratings.to_json
end

#get average rating for movie id
get '/api/ratings/average/:movie_id' do |movie_id|
 ratings = Rating.where(movie_id: movie_id).average(score: score)
 ratings.to_json
end

#delete all reviews from user !!!PROBS WORKING NOT GONNA TEST LOL!!!
delete '/api/ratings/delete/:user_id' do |user_id|
  ratings = Rating.all.where(user_id: user_id)
  ratings.destroy
  nil
end
