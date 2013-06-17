class MapController < ApplicationController

#The resturant form is rendered in the home view due to the modal box being on the homepage

  def show
    @restaurant = Restaurant.new
    @diets = Diet.all
    @restaurants = Restaurant.all
  end

end
