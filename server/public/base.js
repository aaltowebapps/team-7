// defines Base class 
// that handles storage
function Base() {
  this.getBuildingData = function() {
    var data = localStorage.getItem("building-data");
    // TODO: add last_updated timestamp handling
    if (data == null) {
      this.initiateBuildingDataLoading();
      // return a placeholder with no real data
      return {"last_updated": 0, "buildings": [], "floors": []};
    } else {
      return $.parseJSON(data);
    }
  }

  this.storeBuildingData = function(newData) {
    localStorage.setItem("building-data", $.toJSON(newData));
  }

  this.getFloorMap = function(id) {
    return $.parseJSON(localStorage.getItem("floormap-"+id));
  }

  this.storeFloorMap = function(id, newData) {
    localStorage.setItem("floormap-"+id, $.toJSON(newData));
  }

  this.deleteFloorMap = function(id) {
    localStorage.removeItem("floormap-"+id);
  }

  this.listFloorMaps = function() {
    var result = [];
    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      if (key.indexOf("floormap-") == 0) {
        result.push(key.substring(9));
      }
    }
    return result;
  }
  
  this.initiateBuildingDataLoading = function() {
  	// TODO: add error handling
  	$.getJSON('/api/building_data', function(data) {
      base.storeBuildingData(data);
      search.setBuildingData(data);
  	});
  }
}
