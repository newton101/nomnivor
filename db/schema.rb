# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20130614155208) do

  create_table "diets", :force => true do |t|
    t.string   "name"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "diets_restaurants", :force => true do |t|
    t.integer "diet_id"
    t.integer "restaurant_id"
  end

  add_index "diets_restaurants", ["restaurant_id", "diet_id"], :name => "index_diets_restaurants_on_restaurant_id_and_diet_id"

  create_table "location_searches", :force => true do |t|
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
    t.string   "address"
    t.float    "longitude"
    t.float    "latitude"
  end

  create_table "restaurants", :force => true do |t|
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
    t.string   "name"
    t.string   "description"
    t.float    "longitude"
    t.float    "latitude"
    t.string   "venue_id"
  end

end
