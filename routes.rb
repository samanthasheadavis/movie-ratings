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
post '/api/ratings' do
  rating = Rating.new(movie_id: params[:movie_id], user_id: params[:user_id], score: params[:score])
  if rating.valid? && rating.save
    status 201
    rating.to_json
  else
    status 400
  end
end

#get all ratings for user_id !!!WORKING!!!     INCLUDe?????
get '/api/ratings/:user_id' do |user_id|
 ratings = Rating.where(user_id: user_id)
 ratings.to_json
end

#delete all reviews from user
delete '/api/ratings/:user_id' do |user_id|
  ratings = Rating.find_by(user_id: user_id)
  ratings.destroy
  nil
end






# after do
#   ActiveRecord::Base.connection.close
# end
#
# get '/api/composers' do
#   composers = Composer.all
#   composers.to_json
# end
#
# post '/api/composers' do
#   composer = Composer.new(name: params[:name], period: params[:period])
#   if composer.valid? && composer.save
#     status 201
#     composer.to_json
#   else
#     status 400
#   end
# end
#
# get '/api/composers/:id' do |id|
#   composer = Composer.find_by(id: id)
#   composer.to_json
# end
#
# put '/api/composers/:id' do
#   id = params['id']
#   name = params['name']
#   period = params['period']
#   composer = Composer.find_by(id: id)
#   composer.update(name: name, period: period)
#   composer.to_json
# end
#
# delete '/api/composers/:id' do
#   id = params['id']
#   composer = Composer.find_by(id: id)
#   composer.destroy
#   nil
# end
# #put '/api/composers/:id' do
#
# #end
#
# #delete '/api/composers/:id' do
#
# #end
#
#
#
#
# get '/api/pieces' do
#   pieces = Piece.all
#   status 200
#   pieces.to_json
# end
#
# post '/api/pieces' do
#   piece = Piece.new(name: params[:name], composer_id: params[:composer_id])
#   if piece.valid? && piece.save
#     status 201
#     piece.to_json
#   else
#     status 400
#   end
# end
#
# get '/api/pieces/:id' do |id|
#   piece = Piece.find_by(id: id)
#   piece.to_json
# end
#
# put '/api/pieces/:id' do
#   id = params['id']
#   name = params['name']
#   composer_id = params['composer_id']
#   piece = Piece.find_by(id: id)
#   piece.update(name: name, composer_id: composer_id)
#   piece.to_json
# end
#
# delete '/api/pieces/:id' do
#   id = params['id']
#   piece = Piece.find_by(id: id)
#   piece.destroy
#   nil
# end
# #Piece.order(name: something)
# #put '/api/pieces/:id' do
# #piece.delete
# #end
# get '/api/composers_pieces' do
#   composers = Composer.all
#   pieces = Piece.all
#   composers + pieces.to_json
# end
#
# #delete '/api/pieces/:id' do
#
# #end
