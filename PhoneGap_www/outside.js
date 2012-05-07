// class that handles outside view
function Outside() {
  var map;
  var buildingName;
  var buildingMarker;

  $(document).delegate("#outside", "pageinit", function() {
    var options = {
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    };

    map = new google.maps.Map(document.getElementById('map-canvas'), options);

    $(window).resize(resize);
  });

  $(document).delegate("#outside", "pageshow", function() {
    // redirect to search page if we have no info to show
    if (selectedBuilding == null) {
      $.mobile.changePage("#search");
      return;
    }
    resize();

    var loc = new google.maps.LatLng(selectedBuilding["latitude"], selectedBuilding["longitude"]);
    map.setCenter(loc);

    // only update the marker if the building has been changed
    if (buildingName == selectedBuilding["name"]) {
      return;
    }
    buildingName = selectedBuilding["name"];

    // remove the old marker if present
    if (buildingMarker != null) {
      buildingMarker.setMap(null);
    }

    // create the marker
    var options = {
      map: map,
      position: loc,
      labelContent: buildingName,
      labelAnchor: new google.maps.Point(-15, 30),
      labelClass: "nameLabel"
    };
    buildingMarker = new MarkerWithLabel(options);
    google.maps.event.addListener(buildingMarker, 'click', function() {
      $.mobile.changePage( "#inside", { transition: "fade"} );
    });
  });

  var resize = function() {
    var height = window.innerHeight ? window.innerHeight : $(window).height();
    $("#map-canvas").css("min-height", height-$("#outside > [data-role=header]").innerHeight() - 2);
    google.maps.event.trigger(map, "resize");
  }
}
