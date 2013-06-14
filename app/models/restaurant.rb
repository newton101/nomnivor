class Restaurant < ActiveRecord::Base

  attr_accessible :name, :longitude, :latitude, :description, :venue_id
  has_and_belongs_to_many :diets

  validates :name, :longitude, :latitude, :description, :presence => true

  validates :longitude, :numericality => { :only_float => true }
  validates :latitude, :numericality => { :only_float => true }

  def self.create_with_diets(restaurant, diets)
    eatery = Restaurant.create(restaurant)
    eatery.diet_ids = diets
    eatery
  end
  #use a hash instead of interpolation
  def self.find_by_diet_ids(*diet_ids)
    Restaurant.includes(:diets).where("diets.id IN (#{diet_ids.join(',')})")
  end

  def as_json(options={})
    super(options.merge(:include => :diets))
  end

end
