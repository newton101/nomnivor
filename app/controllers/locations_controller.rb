class LocationsController < ApplicationController

  def search
  	address = Geocoder.search params[:address]
	  location = get_lat_long(address)
  	if params.has_key?(:diets)
       restaurants = Restaurant.find_by_diet_ids(params[:diets])
    else
	   restaurants = "no restaurants matched"
	  end
	  render :json => [location, restaurants]
  end

  def get_lat_long(address)
  	coordinates = {
      "latitude" => address[0].latitude,
      "longitude" => address[0].longitude,
      "address" => address[0].address
    }
    return coordinates
  end

end
