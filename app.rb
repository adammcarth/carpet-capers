require "bundler"
require "ostruct"
Bundler.require(:default)

# Set some JTasky goodness
JTask.configure do |config|
  config.file_dir = "storage"
end

helpers do
  def calculate_room_measurements(number, width, length, carpet_type)
    area = Float(width) * Float(length)
    broadloom = area / 3.66

    # If area has more than 2 decimals
    if area.to_s.split(".").last.length > 2
      # Round off to 2 decimal places
      area = area.round(2)
    elsif area.to_s.split(".").last == "0"
      # Remove the '.0' after a whole number
      area = area.round
    end

    # Round broadloom off to the highest whole number
    if broadloom.to_s.split(".").last == "0"
      broadloom = broadloom.to_s.split(".").first
    else
      broadloom = (broadloom + 1).round
    end

    cost = calculate_cost(broadloom, carpet_type)

    # Final output (eg - self.carpet_type #=> standard)
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
  # Render the "GUI" (web interface)
  erb :index
end

get "/calculate" do
  @rooms = Array.new
  params[:measurements].each do |room_number, measurements|
    width = measurements[:width]
    length = measurements[:length]
    carpet_type = measurements[:carpet_type]
    @rooms << calculate_room_measurements(room_number, width, length, carpet_type)
  end

  # Work out if we need to apply a discount to one of the rooms (room count 3 or more)
  if @rooms.count > 2
    costs = Array.new
    # Add the cost of each room to an array
    @rooms.each do |room|
      costs << room.cost
    end
    # Sets a variable containing the lowest number (cost) in the array
    lowest_cost = costs.min
    if @rooms.count == 3
      @rooms.each do |room|
        # 3 rooms, apply a 50% discount to the cheapest room
        room[:discount] = 50 if room.cost == lowest_cost
      end
    else
      @rooms.each do |room|
        # 4+ rooms, apply a 100% discount to the cheapest room
        room[:discount] = 100 if room.cost == lowest_cost
      end
    end
  end

  # Render the page
  content_type :json
  erb :api, :layout => false
end