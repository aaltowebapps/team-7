// defines Base class 
// that handles storage
function Base() {
  var checkedBuildingData = false;
  this.getBuildingData = function() {
    var d = localStorage.getItem("building-data");
    if (d == null) {
      this.initiateBuildingDataLoading(null);
      // return a placeholder with no real data to show while loading the actual data
      return {"last_updated": 0, "buildings": [], "floors": []};
    } else {
      data = $.parseJSON(d);
      if (!checkedBuildingData) {
        // only update once per session
        checkedBuildingData = true;
        lastUpdated = data["last_updated"];
        this.initiateBuildingDataLoading(lastUpdated);
      }
      return data;
    }
  }

  this.storeBuildingData = function(newData) {
    localStorage.setItem("building-data", $.toJSON(newData));
  }

  this.getFloorMap = function(id) {
    return $.parseJSON(localStorage.getItem("floormap-"+id));
  }
  
  this.floorMapExists = function(id) {
    return localStorage.getItem("floormap-" + id) != null;
  }

  this.storeFloorMap = function(newData) {
    var id = newData['id'];
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
    var buildingDataQueryPath;
    var floormapDataQueryPath = '/api/floormap_data/'
  
    if (lastUpdated == null) {
      buildingDataQueryPath = '/api/building_data';
    } else {
      buildingDataQueryPath = '/api/building_data/updated/' + lastUpdated;
    }

    $.getJSON(buildingDataQueryPath, function(buildingData) {
      // Null is returned if there was no updated data
      if (buildingData != null) {
        base.storeBuildingData(buildingData);
        search.setBuildingData(buildingData);
        
        var availableMapImages = {};
        for (var i = 0; i < buildingData['floors'].length; i++) {
          var mapImage = buildingData['floors'][i]['map_image'];
          availableMapImages[mapImage] = true;
        }
        
        localMapImages = base.listFloorMaps();

        for (var i = 0; i < localMapImages.length; i++) {
          localMapImage = localMapImages[i];
          if (!availableMapImages[localMapImage]) {
            // Delete locally stored maps no longer in server data
            base.deleteFloorMap(localMapImage);
          }                    
        }
        
        for (mapImage in availableMapImages) {
          if (base.floorMapExists(mapImage)) {
            // Only new maps are loaded
            continue;
          }
          $.ajax({
            url: floormapDataQueryPath + mapImage,
            dataType : 'json',
            async: false,
            success: function(imageData) {
              base.storeFloorMap(imageData);
            }
          });
        }
      }
    });
  }
}
