require_relative 'settings.rb'
require_relative 'building.rb'
require 'sinatra'
require 'sinatra/reloader' if DEVELOPMENT
require 'base64'
require 'json'
require 'manifesto.rb'

also_reload 'building.rb' if DEVELOPMENT
also_reload 'building_classes.rb' if DEVELOPMENT


get '/' do
# return the client's index file
# TODO: it would make sense to keep all client files in public/
#       but it might break if using Manifesto (check when changing)
  File.read("index.html")
end

get '/manifest' do
  headers 'Content-Type' => 'text/cache-manifest' # Must be served with this MIME type
  contents = File.open(NETWORK_ENTRIES_FILE, 'rb').read
  network = JSON.parse(contents)
  Manifesto.cache(:network_includes => network, :timestamp => false)
end

# Returns the complete set of building data
get '/api/building_data' do
  content_type :json
  building_data
end

# Returns the building data that has been updated since the given time.
get '/api/building_data/updated/:timestamp' do
  content_type :json
  timestamp = Time.parse(params[:timestamp])
  building_data(timestamp)
end

# Returns floormap data (binary contents + basic metadata) for a single floormap.
get '/api/floormap_data/:id' do
  content_type :json
  floormap_data(params[:id]).to_json
end

# accepts room data update from the user
post '/api/send_room_data/' do
  'ok'
end

# Returns the list of all available floormap images.
# TODO: Is this needed at all?
get '/api_old/floormap_list' do
  content_type :json
  floormap_names.to_json
end

# Returns the list of floormap images that have been updated since the given time.
# TODO: Is this needed at all?
get '/api_old/floormap_list/updated/:timestamp' do
  content_type :json
  timestamp = Time.parse(params[:timestamp])
  floormap_names(timestamp).to_json
end

# Returns all floormap data (binary contents + basic metadata).
# TODO: Is this needed at all?
get '/api_old/floormap_data' do
  content_type :json
  names = floormap_names
  floormap_data_collection(names).to_json
end

# Returns all floormap data (binary contents + basic metadata) for floormaps
# that have been updated after the given time.
# TODO: Is this needed at all?
get '/api_old/floormap_data/updated/:timestamp' do
  content_type :json
  timestamp = Time.parse(params[:timestamp])
  names = floormap_names(timestamp)
  floormaps = floormap_data_collection(names).to_json
end



