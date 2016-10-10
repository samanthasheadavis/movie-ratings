#Clean Final
require 'csv'
require_relative 'routes'
require_relative 'environment'
require_relative 'movie'
require_relative 'rating'

def load_item
  ActiveRecord::Base.establish_connection(ENV['DATABASE_URL'])
  movie_list = CSV.foreach('./item/u.item', encoding: 'windows-1252', col_sep: "|")
  movie_list.each do |movie|
    id = movie[0].to_i
    title = movie[1]

    Movie.create(
    id: id,
    title: title
    )
  end
  ActiveRecord::Base.connection.close
end

load_item
