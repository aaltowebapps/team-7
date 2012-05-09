// class for the inside view
function Inside() {
  var floors;
  var floorIndex;
  var showMarker;
  var markerX;
  var markerY;
  var markerFloor;
  var lastHeight;
  var zoom, imageData;
  var shownCount = 0, returnCount = 0;

  $(document).delegate("#inside", "pageinit", function() {
    // bind up/down buttons
    $("#floorDown").click(function () {
      if (floorIndex > 0 && floors.length != 0) {
        floorIndex--;
        updateView();
        lastHeight = null;
        resize();
      }
      return false; // keep it from getting active style
    });
    $("#floorUp").click(function () {
      if (floorIndex < floors.length - 1) {
        floorIndex++;
        updateView();
        lastHeight = null;
        resize();
      }
      return false; // keep it from getting active style
    });
    $("#svgplus").click(function () {
      zoom += 0.1;
      updateZoom();
    });
    $("#svgminus").click(function () {
      zoom -= 0.1;
      updateZoom();
    });

    function gestureChange(event) {
      event.preventDefault();
      var scale = event.scale;

      if (scale < 1) {
        zoom -= 0.01;
      } else if (scale > 1) {
        zoom += 0.01;
      }
      updateZoom();
    }

    window.addEventListener("gesturechange", gestureChange, false);

    $("#floormap").bind("click", function (e) {
      if (!showMarker) {
        var floormap = $("#floormap")[0];
        var realX = e.clientX;
        // remove header height
        var realY = e.clientY - headerHeight();
        // add scroll amounts
        realX += floormap.scrollLeft;
        realY += floormap.scrollTop;
        // use to fix the values
        realX = realX / zoom;
        realY = realY / zoom;
        setMarker(realX, realY);
      }
    });
  });

  $(document).delegate("#inside", "pagebeforeshow", function() {
    $("#zoom-controls").show();

    // redirect to search page if we have no info to show
    if (selectedRoom == null) {
      $.mobile.changePage("#search");
      return;
    }

    // fail hard if no maps are available
    if (selectedBuilding["floor_ids"].length == 0) {
      $("#zoom-controls").hide();
      $("#floormap").html("<p id=\"no-floormaps\">No floor maps available for the selected building. Sorry!</p>");
      $("#floorDown").addClass("ui-disabled");
      $("#floorUp").addClass("ui-disabled");
      setFloorText("");
      floors = [];
      return;
    }

    showMarker = false;
    // check if we have the floor data for the room
    if (selectedRoom["map_data"] == null) {
      if (shownCount > returnCount) {
        returnCount++;
      } else {
        shownCount++;
        floorIndex = 0;
        $.mobile.changePage('#no-roomlocation-notification','pop',false,false);
        return;
      }
    } else {
      // we have room's floor data
      floorIndex = selectedBuilding["floor_ids"].indexOf(selectedRoom["map_data"]["floor_id"]);
      if (floorIndex == -1) { 
        // we have inconsistent building data, should never happen!
        floorIndex = 0;
      } else {
        showMarker = true;
        markerX = selectedRoom["map_data"]["map_x"];
        markerY = selectedRoom["map_data"]["map_y"];
        markerFloor = floorIndex;
      }
    }
    floors = selectedBuilding["floor_ids"]; 
    updateView();

    setInterval(resize, 1000);
    $(window).resize(resize);
  });

  $(document).delegate("#inside", "pageshow", function() {
    lastHeight = null;
    $("#zoom-controls").css("top", headerHeight());
    resize();
  });

  function resize() {
    var height = windowHeight();
    if (height != lastHeight) {
      lastHeight = height;
      $("#floormap").removeOverscroll();
      $("#floormap").css("height", height);
      $("#floormap").overscroll();
    }
  }

  function updateZoom() {
      zoom = Math.max(zoom, initialZoom());
      $("#floormap").removeOverscroll();
      $("#zoomg").attr("transform", "scale("+zoom+","+zoom+")");
      $("#floormap > svg").width(zoom * imageData["width"]);
      $("#floormap > svg").height(zoom * imageData["height"]);
      $("#floormap").overscroll();
  }

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
    imageData = getFloorById(floors[floorIndex]);
    var imageData2 = base.getFloorMap(imageData["map_image"]);
    // update buttons
    setFloorText(imageData["name"]);
    $("#floorDown").toggleClass("ui-disabled", floorIndex == 0);
    $("#floorUp").toggleClass("ui-disabled", floorIndex == floors.length - 1);
    // construct image
    var imageElement = $(Base64.decode(imageData2["contents"]));
    // update DOM
    $("#floormap").append(imageElement);

    // wrap all g elements in a zoom container
    var zoomg = parseSVG('<g id="zoomg">');
    $.each($("#floormap g"), function (i,e) {
      zoomg.firstChild.appendChild(e);
    });
    $("#floormap > svg").append(zoomg);

    if (showMarker && floorIndex == markerFloor) {
      // construct a room marker
      // this code assumes 50x50 marker size
      var x = markerX * imageData["width"];
      var y = markerY * imageData["height"];
      setMarker(x, y);
    }
    
    // calculate initial zoom level. make the map fit into the screen
    zoom = initialZoom();
    updateZoom();
  }

  function setFloorText(text) { 
    $("#curfloor .ui-btn-text").html(text);
  }

  // functions that shows the room marker
  // or if already visible, updates its position
  function setMarker(x, y) {
    if ($("#room-marker").length == 0) {
      // need to add the marker first
      // yep, this is ugly
      $("#zoomg").append(parseSVG(
'<g stroke="#000" id="room-marker" stroke-dasharray="none" stroke-miterlimit="4"><path d="m49.625,25.188a24.562,24.562,0,1,1,-49.125,0,24.562,24.562,0,1,1,49.125,0z" stroke-width="1" fill="none"/><path d="m33.125,26.938a7.625,7.5625,0,1,1,-15.25,0,7.625,7.5625,0,1,1,15.25,0z" stroke-width="0.99974997000000021" fill="#F00"/><path d="m33.125,26.938a7.625,7.5625,0,1,1,-15.25,0,7.625,7.5625,0,1,1,15.25,0z" stroke-width="0.99974997000000021" fill="#F00"/></g>'
      ));
    }

    $("#room-marker").attr("transform", "translate("+(x - 25)+","+(y - 25)+")");
  }

  function parseSVG(s) {
    var div= document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
    div.innerHTML= '<svg xmlns="http://www.w3.org/2000/svg">'+s+'</svg>';
    var frag= document.createDocumentFragment();
    while (div.firstChild.firstChild)
      frag.appendChild(div.firstChild.firstChild);
    return frag;
  }

  function windowWidth() {
    return window.innerWidth ? window.innerWidth : $(window).width();
  }

  function windowHeight() {
    return (window.innerHeight ? window.innerHeight : $(window).height()) - headerHeight() - 2;
  }

  function headerHeight() {
    return $("#inside > [data-role=header]").height();
  }

  function initialZoom() {
    return Math.min(windowWidth() / imageData["width"], windowHeight() / imageData["height"], 1);
  }
}

