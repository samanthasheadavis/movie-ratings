require 'active_record'

class Movie < ActiveRecord::Base
  validates :title, presence: true
  has_many :ratings
end
