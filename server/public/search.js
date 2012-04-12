// class that handles the search view
function Search() {
  var listContainer;
  var buildingData;
  var searchBox;
  var lastSearch;
  var updateInterval;

  $(document).delegate("#search", "pageinit", function() {
    listContainer = $(".searchview_list");
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
  	buildingData = newData;
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
    $.each(buildingData["buildings"], function (bindex, building) {
      var bShown = false;

      $.each(building["rooms"], function (rindex, room) {
        if (filter(building, room)) {
          
          if(!bShown) {
            var buildingLi = $("<li></li>");
            buildingLi.addClass("list_header").addClass("ui-btn-up-a");
            buildingLi.append(building["name"]);
            listContainer.append(buildingLi);
            bShown = true;
          }

          var li = $("<li></li>");
          li.addClass("list_item").addClass("ui-btn-up-c");
          li.append("<div class=list_name>"+room["name"]+"</div>");
          li.append("<a class=\"list_button\" href=\"#outside\"><span class=\"icon_up\"></span></a>");
          li.append("<a class=\"list_button\" href=\"#inside\"><span class=\"icon_down\"></span></a>");
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
