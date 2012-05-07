require 'json'
require 'time'

contents = File.open('building_data.json', 'rb').read

input = JSON.parse(contents)


input['buildings'].each do |b|
	building_number = b['name'].match('\\d+')
	b['rooms'].each do |r|
		r2 = []
		r2 << r['room_id'].gsub(/^\d+/, '')
		r2 << r['room_id']
   		r2 << r['name']

   		r['keywords'] = r2
   	end
end

File.open('test_data.json', 'wb') do |f|
  f.puts JSON.pretty_generate(input)
end