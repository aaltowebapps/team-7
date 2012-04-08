#
# building.rb
#
# Contains logic for accessing building and floormap data.
#

def building_data
  # TODO: implement
  File.open('room_data.json', 'rb')
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
    # TODO: Get values for width, height, content type etc. from database
    fileinfo['width'] = 200
    fileinfo['height'] = 100
    fileinfo['type'] = 'image/png'

    fileinfo
  end
end

# Returns an array of floormap data structures for the given floormap names.
def floormap_data_collection(names)
  floormaps = []
  names.each do |name|
    floormaps << floormap_data(name)
  end
  floormaps
end

