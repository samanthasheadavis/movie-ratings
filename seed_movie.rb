require 'csv'
require_relative 'schema'
require_relative 'environment'
require_relative 'movie'
require_relative 'rating'

def load_item
  movie_list = CSV.foreach('./item/u.item', encoding: 'windows-1252', col_sep: "|")
  movie_list.each do |movie|
    id = movie[0].to_i
    title = movie[1]

    Movie.create(
    id: id,
    title: title
    )
  end
end

load_item
