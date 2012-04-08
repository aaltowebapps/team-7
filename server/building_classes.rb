class Building
  attr_accessor :name, :latitude, :longitude, :floor_ids, :rooms

  def to_json(*a)
    {
      'name' => name,
      'latitude' => latitude,
      'longitude' => longitude,
      'floor_ids' => floor_ids,
      'rooms' => rooms
    }.to_json(*a)
  end
end

class Floor
  attr_accessor :floor_id, :map_image, :width, :height, :name

  def to_json(*a)
    {
      'floor_id' => floor_id,
      'name' => name,
      'map_image' => map_image,
      'width' => width,
      'height' => height
    }.to_json(*a)
  end
end

class Room
  attr_accessor :name, :room_id, :keywords, :map_data
  
  def to_json(*a)
    {
      'room_id' => room_id,
      'name' => name,
      'keywords' => keywords,
      'map_data' => map_data
    }.to_json(*a)
  end
end

class MapData
  attr_accessor :floor_id, :map_x, :map_y
  
    def to_json(*a)
    {
      'floor_id' => name,
      'map_x' => room_id,
      'map_y' => keywords,
    }.to_json(*a)
  end
end