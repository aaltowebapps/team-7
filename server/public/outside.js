// class that handles outside view
function Outside() {
  var map;
  var buildingName;
  var buildingMarker;
  var locationMarker;
  var watchID;
  var mapInitialized = false;
  var mapAvailable = false;

  $(document).delegate("#outside", "pageinit", function() {
    if (isMapLoaded()) {
      mapAvailable = true;
      var options = {
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true
      };

      map = new google.maps.Map(document.getElementById('map-canvas'), options);

      $(window).resize(resize);
    }
  });

  $(document).delegate("#outside", "pageshow", function() {
    // redirect to search page if we have no info to show
    if (selectedBuilding == null) {
      $.mobile.changePage("#search");
      return;
    }

    if (!mapAvailable) {
      $("#map-canvas").html("The app was started in offline mode which means Google Maps couldn't be loaded. Please go online and refresh the page to access the outside view.");
      return;
    }

    resize();

    if (!mapInitialized && navigator.geolocation) {
      mapInitialized = true;
      var locationMarker_options = {
        map: map,
        position: null,
        icon: new google.maps.MarkerImage('icons/blue_ball16.png', new google.maps.Size(16, 16), new google.maps.Point(0, 0), new google.maps.Point(8, 8))
      };

      locationMarker = new google.maps.Marker(locationMarker_options);

      function showLocation(position) {
        var userLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        /* Lets set it just once, because otherwise user couldn't controll the map */
        if (locationMarker.getPosition() == null) {
          map.fitBounds(getBounds(buildingMarker.getPosition(), userLocation));
        }

        locationMarker.setPosition(userLocation);
      }

      watchID = navigator.geolocation.watchPosition(showLocation);
    } else {
      /* browser does not support geolocation*/
    }

    var loc = new google.maps.LatLng(selectedBuilding["latitude"], selectedBuilding["longitude"]);

    if (map.getCenter() == undefined) {
      // Center the map only if it's not already centered
      map.setCenter(loc);
    }

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

    var image = new google.maps.MarkerImage('icons/house.png',
        new google.maps.Size(16, 16)
    );

    var options = {
      map: map,
      position: loc,
      labelContent: buildingName,
      labelAnchor: new google.maps.Point(-15, 30),
      labelClass: "nameLabel",
      icon: image
    };

    buildingMarker = new MarkerWithLabel(options);

    if (locationMarker.getPosition() != null) {
      map.fitBounds(getBounds(buildingMarker.getPosition(), locationMarker.getPosition()));
    }

    google.maps.event.addListener(buildingMarker, 'click', function() {
      $.mobile.changePage( "#inside", { transition: "fade"} );
    });

    $(".nameLabel").click(function (e) {
      $.mobile.changePage( "#inside", { transition: "fade"} );
    });
  });

  var resize = function() {
    var height = window.innerHeight ? window.innerHeight : $(window).height();
    $("#map-canvas").css("min-height", height-$("#outside > [data-role=header]").innerHeight() - 2);
    google.maps.event.trigger(map, "resize");
  }
  
  var getBounds = function(pos1, pos2) {
    var sw = new google.maps.LatLng(Math.min(pos1.lat(), pos2.lat()), Math.min(pos1.lng(), pos2.lng()));
    var ne = new google.maps.LatLng(Math.max(pos1.lat(), pos2.lat()), Math.max(pos1.lng(), pos2.lng()));
    return new google.maps.LatLngBounds(sw, ne);
  }

  function isMapLoaded() {
    return (typeof google != "undefined");
  }
}
