#Clean Final
require 'active_record'

class Rating < ActiveRecord::Base
  validates :user_id, :movie_id, :score, presence: true
  belongs_to :movie
end
