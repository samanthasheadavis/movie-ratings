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

post '/api/movies/title' do
  movie = Movie.new(title: params[:title])
   if movie.valid? && movie.save
     status 201
     movie.to_json
   else
     status 400
   end
end

get '/api/get/movie/:title' do |title|
  movie_data = Movie.where(["title LIKE ?", "%#{params[:title]}%"])
  movie_info = movie_data[0]

  rating = Rating.select(:score).where(movie_id: movie_info[:id]).average(:score)

  top_users = Rating.all.where(movie_id: movie_info[:id]).where(score: 5).limit(5)

  payload = {'movie_info' => movie_info, 'rating' => rating, 'top_users' => top_users}
  payload.to_json
end

get '/api/twenty/movies' do
  movie = Movie.limit(20)
  movie.to_json
end

get '/api/delete/movie/:id' do |id|
  movie = Movie.find_by(id: id)
  movie.to_json
end

post '/api/post/ratings/post' do
  rating = Rating.new(movie_id: params[:movie_id], user_id: params[:user_id], score: params[:score])
  if rating.valid? && rating.save
    status 201
    rating.to_json
  else
    status 400
  end
end

get '/api/ratings/of/user/:user_id' do |user_id|
  ratings = Rating.all.where(user_id: user_id)
  ratings.to_json
end

get '/api/ratings/top/:user_id' do |user_id|
  ratings = Rating.all.where(user_id: user_id).where(score: 5)
  ratings.to_json
end

get '/api/ratings/top/five/:movie_id' do |movie_id|
  ratings = Rating.all.where(movie_id: movie_id).where(score: 5).limit(5)
  ratings.to_json
end

get '/api/ratings/movie/avg/:movie_id' do |movie_id|
  ratings = Rating.select(:score).where(movie_id: movie_id).average(:score)
  ratings.to_json
end

delete '/api/ratings/delete/:user_id' do |user_id|
  ratings = Rating.all.where(user_id: user_id)
  ratings.destroy
  nil
end
