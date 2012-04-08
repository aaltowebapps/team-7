require_relative 'building_classes.rb'

#
# building.rb
#
# Contains logic for accessing building and floormap data.
#

def building_data
  # TODO: replace with datamapper configuration and fetching logic
  building = Building.new
  
  building.name='T-talo'
  building.latitude = 60.15
  building.longitude = 24.5
  building.floor_ids = [11, 12]

  building.rooms = []
  building.rooms[0] = Room.new
  building.rooms[0].name = 'T1-sali'
  building.rooms[0].room_id = 21
  building.rooms[0].keywords = ['T1-sali', 'Sali T1']
  building.rooms[0].map_data = {'floor_id' => 11, 'map_x' => 0.25, 'map_y' => 0.7}

  building.rooms[1] = Room.new
  building.rooms[1].name = 'T2-sali'
  building.rooms[1].room_id = 22
  building.rooms[1].keywords = ['T2-sali', 'Sali, jonka map_data puuttuu, koska kerroksesta ei ole tietoa!']

  floor1 = Floor.new
  floor1.floor_id = 11
  floor1.name = '1'
  floor1.map_image = 'ttalo-1-kerros.png'
  floor1.width = 500
  floor1.height = 600

  floor2 = Floor.new
  floor2.floor_id = 21
  floor2.name = '2'
  floor2.map_image = 'ttalo-2-kerros.png'
  floor2.width = 500
  floor2.height = 600
 
  data = {
    'last_updated' => '2012-04-08T12:00:00Z',
    'buildings' => [building],
    'floors' => [floor1, floor2]
  }
  data.to_json  

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

