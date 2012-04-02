require 'nokogiri'
require 'json'

# read the dom
d = Nokogiri::HTML(open("tilaluntti_input.html"))

buildings = []

# find each building table
d.css("table.confluenceTable").each {|t|
  # process each table row
  building_data = {}
  t.css("tr").each {|row|
    columns = row.css("td")
    # skip the header
    next if columns.empty?

    if building_data.empty?
      # read the first row
      building_data["name"] = columns[0].text.strip
      building_data["rooms"] = []
    else
      # read the room data
      room_data = {}
      room_data["room_code"] = columns[1].text.strip
      room_data["room_name"] = columns[2].text.strip
      building_data["rooms"] << room_data
    end
  }
  buildings << building_data
}

puts(JSON.pretty_generate(buildings))
