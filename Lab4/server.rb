# stop ssl errors when using instagram
require 'openssl'
OpenSSL::SSL::VERIFY_PEER = OpenSSL::SSL::VERIFY_NONE
require 'sinatra'
require 'sinatra/reloader' 
require 'base64'
require 'json'
require 'open-uri'

INSTAGRAM_API_KEY = "ffc1e462cbc8442d9247ea1b32fb45e1"

get '/' do
  redirect '/index.html'
end

# paths for instagram API
# need to have a server because of origin policy
get '/places/:lat/:lng/' do |lat, lng|
  content_type :json
  open("https://api.instagram.com/v1/locations/search?lat=#{lat}&lng=#{lng}&client_id=#{INSTAGRAM_API_KEY}")
end

get '/images/:id/' do |id|
  content_type :json
  open("https://api.instagram.com/v1/locations/#{id}/media/recent/?client_id=#{INSTAGRAM_API_KEY}")
end

# acts as a wrapper for getting image data
# url is in base64
get '/get_url/:url/' do |url|
  content_type :jpg
  url = Base64.decode64(url).gsub("\\/", "/")
  open(url)
end

post '/uploadBase64' do
  File.open("public/snapshots/"+(Time.now.to_f * 10).floor.to_s+".png", "wb") do |f| 
    f.write Base64.decode64(Base64.decode64(params["img"]).gsub("data:image/png;base64,", ""))
  end 
end
