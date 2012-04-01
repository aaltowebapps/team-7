require_relative "settings.rb"
require 'sinatra'
require 'sinatra/reloader' if DEVELOPMENT
require 'base64'
require 'json'

FLOORMAP_DIR = 'floormaps'

get '/' do
# return the client's index file
# TODO: it would make sense to keep all client files in public/
#       but it might break if using Manifesto (check when changing)
  File.read("index.html")
end

# Returns the list of all available floormap images.
# TODO: Is this needed at all?
get '/api/floormap_list' do
  content_type :json
  floormap_names.to_json
end

# Returns the list of floormap images that have been updated since the given time.
get '/api/floormap_list/updated/:timestamp' do
  content_type :json
  timestamp = Time.parse(params[:timestamp])
  floormap_names(timestamp).to_json
end

# Returns all floormap data (binary contents + basic metadata).
get '/api/floormap_data' do
  content_type :json
  names = floormap_names
  floormap_data_collection(names).to_json
end

# Returns all floormap data (binary contents + basic metadata) for floormaps
# that have been updated after the given time.
get '/api/floormap_data/updated/:timestamp' do
  content_type :json
  timestamp = Time.parse(params[:timestamp])
  names = floormap_names(timestamp)
  floormaps = floormap_data_collection(names).to_json
end

# Returns floormap data (binary contents + basic metadata) for a single floormap.
get '/api/floormap_data/:id' do
  content_type :json
  floormap_data(params[:id]).to_json
end


# Returns available floormap names. If timestamp is given, only files newer
# than the given time are returned.
def floormap_names(timestamp = nil)
  Dir.chdir(FLOORMAP_DIR) do
    names = []
    files = Dir.entries('.')
    files.each do |file|
      if File.file?(file) && (timestamp == nil || File.mtime(file) > timestamp)
        names << file
      end
    end
    names
  end
end

# Returns structural floormap data (binary content + metadata) for the given id.
def floormap_data(id)
  Dir.chdir(FLOORMAP_DIR) do
    contents = File.open(id, 'rb').read

    fileinfo = Hash.new
    fileinfo['id'] = id
    fileinfo['contents'] = Base64.encode64(contents)
    fileinfo['timestamp'] = File.mtime(id).iso8601
    # TODO: Get values for width, height, content type etc. from file or database
    fileinfo['width'] = 200
    fileinfo['height'] = 100
    fileinfo['type'] = 'image/png'

    fileinfo
  end
end

def floormap_data_collection(names)
  floormaps = []
  names.each do |name|
    floormaps << floormap_data(name)
  end
  floormaps
end