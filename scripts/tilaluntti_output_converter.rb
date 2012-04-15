require 'json'
require 'time'

# Converts tilaluntti_output format to transmission format

contents = File.open('tilaluntti_output.json', 'rb').read

result = Hash.new

result['buildings'] = []

input = JSON.parse(contents)

input.each do |b|
  building = Hash.new
  building['name'] = b['name']
  building['latitude'] = b['latitude']
  building['longitude'] = b['longitude']
  building['floor_ids'] = []
  building['rooms'] = []

  b['rooms'].each do |r|
    name = r['room_name']
    weboodi_code = r['room_code']
    
    room = Hash.new
    room['room_id'] = weboodi_code
    room['name'] = name
    room['keywords'] = []
    room['keywords'] << name
    room['keywords'] << weboodi_code
    room['map_data'] = nil
    
    building['rooms'] << room
  end
  
  result['buildings'] << building
end

File.open('building_data.json', 'wb') do |f|
  f.puts JSON.pretty_generate(result)
end