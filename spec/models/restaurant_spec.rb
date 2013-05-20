require 'spec_helper'

describe Restaurant do

  let(:restaurant) {Restaurant.new(:name => "Dorsia", :longitude => "51.5171", :latitude => "-0.1062", :description => "Four year waiting list to get in line for a table." )}

  it 'has a name' do
  restaurant.name.should eq "Dorsia"

  end

  it 'has a longitude' do
  restaurant.longitude.should eq 51.5171

  end

  it 'has a latitude' do
  restaurant.latitude.should eq -0.1062

  end

  it 'has a description' do
  restaurant.description.should eq "Four year waiting list to get in line for a table."

  end

  it { should validate_presence_of(:name) }

  it { should validate_presence_of(:longitude) }

  it { should validate_presence_of(:latitude) }

  it { should validate_presence_of(:description) }

  it { should validate_numericality_of :longitude}

  it { should validate_numericality_of :latitude}

  it 'converts an integer into a float' do
    r = Restaurant.new(:longitude => 1)
    r.longitude.should eq 1.0
  end

end
