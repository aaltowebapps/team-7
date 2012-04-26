require "./server/server.rb"

Dir.chdir("server/")
run Sinatra::Application
