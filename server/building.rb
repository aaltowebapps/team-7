require_relative 'building_classes.rb'

#
# building.rb
#
# Contains logic for accessing building and floormap data.
#

# Returns all building data in JSON format (see wiki, TODO: URL).
def building_data(timestamp = nil)
  # TODO: replace temporary static test data with live data read from DB
  data_file = 'building_data.json'
  contents = File.open(data_file, 'rb').read

  data = JSON.parse(contents)
  
  if data['last_updated'] == nil
    data['last_updated'] = File.mtime(data_file).iso8601
  end
    
  if (timestamp == nil || Time.parse(data['last_updated']) > timestamp)
    return JSON.pretty_generate(data)  
  else
    return ''
  end
end

# Returns available floormap names. If timestamp is given, only files newer
# than the given time are returned.
def floormap_names(timestamp = nil)
  names = []
  basenames = Dir.entries(FLOORMAP_DIR)
  basenames.each do |basename|
    filename = File.join(FLOORMAP_DIR, basename)
    if File.file?(filename) && (timestamp == nil || File.mtime(filename) > timestamp)
      names << basename
    end
  end
  names
end

# mappings between file endings & mime types. contains only those which aren't the same
MIME_TYPE_FOR_ENDING = {"svg" => "image/svg+xml"}

# Returns structural floormap data (binary content + metadata) for the given id.
def floormap_data(id)
  contents = File.open(File.join(FLOORMAP_DIR, id), 'rb').read

  fileinfo = Hash.new
  fileinfo['id'] = id
  fileinfo['contents'] = Base64.encode64(contents)
  fileinfo['timestamp'] = File.mtime(File.join(FLOORMAP_DIR, id)).iso8601
  # TODO: Get values for width, height, content type etc. from database
  fileinfo['width'] = 200
  fileinfo['height'] = 100

  ending = id.split('.')[-1]
  fileinfo['type'] = MIME_TYPE_FOR_ENDING[ending] || ('image/' + ending)

  fileinfo
end

# Returns an array of floormap data structures for the given floormap names.
def floormap_data_collection(names)
  floormaps = []
  names.each do |name|
    floormaps << floormap_data(name)
  end
  floormaps
end

