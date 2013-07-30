  class RestaurantsController < ApplicationController

  def create
   @restaurant = Restaurant.create_with_diets(params[:restaurant], params[:diets])
    if @restaurant.valid?
      flash[:notice] = "Restaurant has been added"
      redirect_to root_url
    else
      render :json => { :message => "The information you entered about the restaurant was not correct. Please try again!" }
    end
  end

  def index
    if params.has_key?(:diets)
       @restaurants = Restaurant.find_by_diet_ids(params[:diets])
    else
      @restaurants = Restaurant.all
    end
      render :json => @restaurants
  end
end
