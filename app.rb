require "bundler"
require "ostruct"
Bundler.require(:default)

# Set some JTasky goodness
JTask.configure do |config|
  config.file_dir = "storage"
end

helpers do
  def calculate_room_measurements(number, width, height, carpet_type)
    area = Float(width) * Float(height)
    broadloom = area / 3.66

    if area.to_s.split(".").last.length > 2
      area = area.round(2)
    elsif area.to_s.split(".").last == "0"
      area = area.round
    end

    if broadloom.to_s.split(".").last == "0"
      broadloom = broadloom.to_s.split(".").first
    else
      broadloom = (broadloom + 1).round
    end

    cost = calculate_cost(broadloom, carpet_type)

    return OpenStruct.new(:number => number, :area => area, :broadloom => broadloom, :carpet_type => carpet_type, :cost => cost)
  end

  def calculate_cost(broadloom, carpet_type)
    if carpet_type == "standard"
      return broadloom * 20
    elsif carpet_type == "premium"
      return broadloom * 30
    elsif carpet_type == "executive"
      return broadloom * 50
    end
  end
end

get "/" do
  erb :index
end

get "/calculate" do
  @rooms = Array.new
  params[:measurements].each do |room_number, measurements|
    width = measurements[:width]
    height = measurements[:height]
    carpet_type = measurements[:carpet_type]
    @rooms << calculate_room_measurements(room_number, width, height, carpet_type)
  end

  # Render the page
  content_type :json
  erb :api, :layout => false
end