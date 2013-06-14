class AddVenueIdColumnToRestaurants < ActiveRecord::Migration
  def change
  	add_column :restaurants, :venue_id, :string
  end
end
