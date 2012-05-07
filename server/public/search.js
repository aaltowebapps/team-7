// class that handles the search view
function Search() {
  var listContainer;
  var buildingData;
  var searchBox;
  var lastSearch;
  var updateInterval;

  $(document).delegate("#search", "pageinit", function() {
    listContainer = $(".searchview-list");
    buildingData = base.getBuildingData();
    
    searchBox = $("#search-basic");

    checkNavButtons();

    // bind view updating to many events & a timer
    // to always have view up to date
    searchBox.keyup(updateView);
    searchBox.blur(updateView);
    searchBox.change(updateView);
    updateInterval = setInterval(updateView, 1000);
    renderRooms(function (b,r) {return true;});
  });

  /* Disables & enables outside&inside nav-buttons */
  var checkNavButtons = function() {
    if (selectedBuilding == null) {
      $(".disableable").addClass("ui-disabled");
    } else {
      $(".disableable").removeClass("ui-disabled");
    }
  }

  this.setBuildingData = function(newData) {
    // set the new data & force view redraw
    buildingData = newData;
    lastSearch = null;
  }

  var updateView = function() {
    checkNavButtons();

    // don't update unless necessary
    if (lastSearch == searchBox.val()) {
      return;
    }
    lastSearch = searchBox.val();

    renderRooms(function (b, r) {
      var found = false;
      $.each(r["keywords"], function() {
        if(this.toLowerCase().indexOf(lastSearch.toLowerCase()) != -1) {
          found = true;
        }
      });

      return r["name"].toLowerCase().indexOf(lastSearch.toLowerCase()) != -1 || found;
    });
  }

  var renderRooms = function(filter) {
    listContainer.html("");

    // fix the scroll problem?
    $.mobile.silentScroll(0);

    $.each(buildingData["buildings"], function (bindex, building) {
      var bShown = false;

      $.each(building["rooms"], function (rindex, room) {
        if (filter(building, room)) {
          
          if(!bShown) {
            var buildingLi = $("<li></li>");
            buildingLi.addClass("list-header").addClass("ui-btn-up-a");
            buildingLi.append(building["name"]);
            listContainer.append(buildingLi);
            bShown = true;
          }

          var li = $("<li></li>");
          li.addClass("list-item").addClass("ui-btn-up-c");
          li.append("<div class=\"list-name\">"+room["keywords"][0]+"</div>");
          li.append("<a class=\"list-button\" href=\"#outside\"><span class=\"icon-up\"></span></a>");
          li.append("<a class=\"list-button\" href=\"#inside\"><span class=\"icon-down\"></span></a>");
          li.find("a").click(function () {
            selectedBuilding = building;
            selectedRoom = room;
          });
          listContainer.append(li);
        }
      });
    });
  }
}
