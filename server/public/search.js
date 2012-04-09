// class that handles the search view
function Search() {
  var listContainer;
  var buildingData;
  var searchBox;
  var lastSearch;
  var updateInterval;

  $(function() {
    listContainer = $(".searchview_list");
    buildingData = base.getBuildingData();
    searchBox = $("#search-basic");
    // bind view updating to many events & a timer
    // to always have view up to date
    searchBox.keyup(updateView);
    searchBox.blur(updateView);
    updateInterval = setInterval(updateView, 1000);
    renderRooms(function (b,r) {return true;});
  });

  var updateView = function() {
    // don't update unless necessary
    if (lastSearch == searchBox.val()) {
      return;
    }
    lastSearch = searchBox.val();

    renderRooms(function (b, r) {
      return r["name"].toLowerCase().indexOf(lastSearch.toLowerCase()) != -1;
    });
  }

  var renderRooms = function(filter) {
    listContainer.html("");
    $.each(buildingData["buildings"], function (bindex, building) {
      $.each(building["rooms"], function (rindex, room) {
        if (filter(building, room)) {
          var li = $("<li></li>");
          li.addClass("list_item").addClass("ui-btn-up-c");
          li.append("<div class=list_name>"+room["name"]+"</div>");
          li.append("<a class=\"list_button\" href=\"#inside\"><span class=\"icon_down\"></span></a>");
          li.append("<a class=\"list_button\" href=\"#outside\"><span class=\"icon_up\"></span></a>");
          listContainer.append(li);
        }
      });
    });
  }
}
