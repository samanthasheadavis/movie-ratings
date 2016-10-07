require_relative 'environment'
require 'active_record'

class CreateTables < ActiveRecord::Migration[5.0]
  def up
    create_table :movies do |t|
      t.string :title
    end

    create_table :ratings do |t|
      t.belongs_to :movie
      t.integer :movie_id
      t.integer :user_id
      t.integer :score
    end

    add_foreign_key :ratings, :movies, column: :movie_id, primary_key: "id"
  end

  def down
    drop_table :ratings

    drop_table :movies
  end
end

def main
  action = (ARGV[0] || :up).to_sym

  CreateTables.migrate(action)
end

main if __FILE__ == $PROGRAM_NAME
