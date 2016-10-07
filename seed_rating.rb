require 'csv'
require_relative 'schema'
require_relative 'environment'
require_relative 'movie'
require_relative 'rating'


def load_data
  rating_list = CSV.read('./data/u.data', encoding: 'windows-1252', col_sep: "\t")
  rating_list.each do |row|
    movie_id = row[0].to_i
    user_id = row[1].to_i
    score = row[2].to_i

    Rating.create(
    movie_id: movie_id,
    user_id: user_id,
    score: score
    )
  end
end


load_data
