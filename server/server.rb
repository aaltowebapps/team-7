require_relative "settings.rb"
require 'sinatra'
require 'sinatra/reloader' if DEVELOPMENT

get '/' do
  # return the client's index file
  # TODO: it would make sense to keep all client files in public/
  #       but it might break if using Manifesto (check when changing)
  File.read("index.html")
end

get '/api/test_data' do
  # just a placeholder before we get actual communications specified
  content_type :json
  File.read("test_data.json")
end
