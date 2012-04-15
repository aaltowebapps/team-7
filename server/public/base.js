// defines Base class 
// that handles storage
function Base() {
  this.getBuildingData = function() {
    var d = localStorage.getItem("building-data");
    if (d == null) {
      this.initiateBuildingDataLoading(null);
      // return a placeholder with no real data to show while loading the actual data
      return {"last_updated": 0, "buildings": [], "floors": []};
    } else {
      data = $.parseJSON(d);
      lastUpdated = data["last_updated"];
      this.initiateBuildingDataLoading(lastUpdated);
      return data;
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
  
  this.initiateBuildingDataLoading = function(lastUpdated) {
  	// TODO: add error handling
  	var queryPath;
  	if (lastUpdated == null) {
  	  queryPath = '/api/building_data';
  	}
  	else {
  	  queryPath = '/api/building_data/updated/' + lastUpdated;
  	}
  	  	
  	$.getJSON(queryPath, function(data) {
      // Null is returned if there was no updated data
      if (data != null) {
        base.storeBuildingData(data);
        search.setBuildingData(data);
      }
  	});
  }
}
