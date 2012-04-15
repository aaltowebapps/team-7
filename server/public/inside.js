// class for the inside view
function Inside() {
  var floors;
  var floorIndex;

  $(document).delegate("#inside", "pageinit", function() {
    // bind up/down buttons
    $("#floorDown").click(function () {
      if (floorIndex > 0 && floors.length != 0) {
        floorIndex--;
        updateView();
      }
      return false; // keep it from getting active style
    });
    $("#floorUp").click(function () {
      if (floorIndex < floors.length - 1) {
        floorIndex++;
        updateView();
      }
      return false; // keep it from getting active style
    });
  });

  $(document).delegate("#inside", "pageshow", function() {
    // redirect to search page if we have no info to show
    if (selectedRoom == null) {
      $.mobile.changePage("#search");
      return;
    }

    // fail hard if no maps are available
    if (selectedBuilding["floor_ids"].length == 0) {
      $("#floormap").html("No floor maps available for the selected building. Sorry!");
      $("#floorDown").addClass("ui-disabled");
      $("#floorUp").addClass("ui-disabled");
      setFloorText("");
      floors = [];
      return;
    }

    // check if we have the floor data for the room
    if (selectedRoom["map_data"] == null) {
      floorIndex = 0;
    } else {
      // we have room's floor data
      floorIndex = selectedBuilding["floor_ids"].indexOf(selectedRoom["map_data"]["floor_id"]);
      if (floorIndex == -1) { 
        // we have inconsistent building data, should never happen!
        floorIndex = 0;
      }
    }
    floors = selectedBuilding["floor_ids"]; 
    updateView();
  });

  function getFloorById(id) {
    var allFloors = base.getBuildingData()["floors"];
    var result = null;
    $.each(allFloors, function (i, e) {
      if (e["floor_id"] == id) {
        result = e;
      }
    });
    return result;
  }

  function updateView() {
    $("#floormap").html("");
    // get the data
    var data = getFloorById(floors[floorIndex]);
    var imageData = base.getFloorMap(data["map_image"]);
    // update buttons
    setFloorText(data["name"]);
    $("#floorDown").toggleClass("ui-disabled", floorIndex == 0);
    $("#floorUp").toggleClass("ui-disabled", floorIndex == floors.length - 1);
    // construct image
    var imageElement = new Image();
    imageElement.src = "data:"+imageData["type"]+";base64,"+imageData["contents"];
    $("#floormap").append(imageElement);
  }

  function setFloorText(text) { 
    $("#curfloor .ui-btn-text").html(text);
  }
}
