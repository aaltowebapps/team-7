// class for the inside view
function Inside() {
  $(document).delegate("#inside", "pageinit", function() {
    // stub
  });

  $(document).delegate("#inside", "pageshow", function() {
    // redirect to search page if we have no info to show
    if (selectedRoom == null) {
      $.mobile.changePage("#search");
      return;
    }
  });
}
