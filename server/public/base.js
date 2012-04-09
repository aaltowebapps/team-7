// defines Base class 
// that handles storage
function Base() {
  this.getBuildingData = function() {
    // TODO: remove placeholder data once actual communications have been written
return {"last_updated":"2012-04-08T12:00:00Z","buildings":[{"name":"T-talo","latitude":60.18689745913466,"longitude":24.821578044211037,"floor_ids":[11,12],"rooms":[{"room_id":21,"name":"T1-sali","keywords":["T1-sali","Sali T1"],"map_data":{"floor_id":11,"map_x":0.25,"map_y":0.7}},{"room_id":22,"name":"T2-sali","keywords":["T2-sali","Sali, jonka map_data puuttuu, koska kerroksesta ei ole tietoa!"],"map_data":null}]},{"name":"Testi-talo","latitude":60.28689745913466,"longitude":24.821578044211037,"floor_ids":[11,12],"rooms":[{"room_id":23,"name":"Testi-sali","keywords":["Testi-sali","hieno paikka"],"map_data":null},{"room_id":24,"name":"Mesta","keywords":["QWERTY","Sali, jonka map_data puuttuu, koska kerroksesta ei ole tietoa!"],"map_data":null}]}],"floors":[{"floor_id":11,"name":"1","map_image":"ttalo-1-kerros.png","width":500,"height":600},{"floor_id":21,"name":"2","map_image":"ttalo-2-kerros.png","width":500,"height":600}]};
    // load building data from the localStorage
    var data = localStorage.getItem("building-data");
    if (data == null) {
      // return a placeholder with no real data
      return {"last_updated": 0, "buildings": [], "floors": []};
    } else {
      return $.parseJSON(data);
    }
  }

  this.storeBuildingData = function(newData) {
    // TODO: notify search page that the data has been updated
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
}
