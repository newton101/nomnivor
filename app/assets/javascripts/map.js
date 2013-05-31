$(document).ready(function() {

  // var venues = [];
  var map = L.mapbox.map('map', 'examples.map-20v6611k').setView([51.5, -0.08], 16);

  getRestaurants();


  var group = L.geoJson(null, {
    style: null,
    onEachFeature: function(feature, layer) {
      var title = feature.properties.title;
      var description = feature.properties.description;
      var diets = feature.properties.diets;
         layer.bindPopup(popupHtml(title, description, diets));
     }
  }).addTo(map);


  function popupHtml(title, description, diets) {
    return "<p><strong>" + title + "</strong></p><p>" + description + "</p><p>" + eachDietName(diets) + "</p>" ;
  }

  function eachDietName(diets){
    var dietsString = ''
    $.each(diets, function(index, diet){
         dietsString += diet.name + ', ';
    });
    return dietsString.substring(0, dietsString.lastIndexOf(', '));
  }

  function getRestaurants() {
    $.ajax({
    type: "GET",
    url: "/restaurants/",
    data: $(this).serialize(),
    success: function(data){
      var collection = createGeoJsonCollection(data);
             group.clearLayers();
             group.addData(collection);
      }
    });
  }


  // var group = L.geoJson(null, {
  //   style: null,
  //   onEachFeature: function (feature, layer) {
  //       layer.bindPopup("<p>"+"<strong>"+feature.properties.title+"</strong>"+"</p>" + "<p>"+feature.properties.description+"</p>");
  //       }
  //   }).addTo(map);


  $(".diet-filter").submit(function(e){
    e.preventDefault();
      $.ajax({
        type: "GET",
        url: "/restaurants/",
        data: $(this).serialize(),
        success: function(data){
          var collection = createGeoJsonCollection(data);
             group.clearLayers();
             group.addData(collection);

        }
      });
    });
  // };



  // function createGeoJsonCollection(array){
  //   json_array = []
  //   $.each(array, function(index, element){
  //     var feature = {type: "Feature",
  //       geometry: {type: "Point", coordinates: [element.longitude, element.latitude]},
  //       properties: { "title": element.name, "description": element.description}}
  //       json_array.push(feature);
  //     });
  //   return json_array;
  // };






  function createGeoJsonCollection(array){
      var json_array = []
      $.each(array, function(index, element){
          var feature = {type: "Feature",
          geometry: {type: "Point", coordinates: [element.longitude, element.latitude]},
          properties: {
            "title": element.name,
            "description": element.description,
            "diets" : element.diets }}
          });
    }

  // var clientid = "F2TFZIIG0IVCY4UU3XZPMMK0YG5XKL5LDPSGWO3KRZWUD2GT";
  // var clientsec = "EKTERA4XDUW5M1WLU4NT2V3ARPAQTHL4P1AENIHIZ1ZJHDVJ";




  // $('#name_auto_complete').keyup(function() {callFoursquareForTypeahead();
  // });

  // $('#name_auto_complete').blur(function() {
  //   fillLatLng();
  // });


  // function callFoursquareForTypeahead() {
  //   $('#name_auto_complete').typeahead({
  //       minLength: 3,
  //       source: function(query, process) {
  //           foursquareQuery(query);
  //           process(venueNames());
  //       }
  //   });
  // }

  // function venueNames() {
  //   return _.map(venues, function(venue) { return displayName(venue) });
  // }

  // function displayName(venue) {
  //   return venue.name + " (" + venue.location.address + ")"
  // }


  // function venuesFound(minivenues) {
  //   venues = minivenues;
  // }

  // function foursquareQuery(query) {
  //   var urlString = "https://api.foursquare.com/v2/venues/suggestCompletion?ll="+locate()+"&client_id=" + clientid +"&client_secret="+clientsec;
  //   $.get(urlString, {query: $('#name_auto_complete').val()}, function(json) {
  //     venuesFound(json.response.minivenues)
  //   });
  // };

  // function fillLatLng() {
  //   venueLatLng(venues);
  // }


  // function venueLatLng(venues) {
  //   _.each(venues, function(venue){
  //     if (displayName(venue) == $('#name_auto_complete').val()) {
  //       $("#latitude-field").val(venue.location.lat);
  //       $("#longitude-field").val(venue.location.lng);
  //     };
  //   })
  // }


  $("#find_me").click(function() {
    map.locate();
    map.on('locationfound', function(e) {
      map.setView(e.latlng, 16);
  	});
    $(".hero-unit").hide('fast');
    map.center
  });

  function locate() {
    var current_latlng = [map.getCenter().lat,map.getCenter().lng];
    return String(current_latlng);
  };

  $(".close").click(function() {
    $(".hero-unit").hide('fast');
  });


  $('.multiselect').multiselect({
    buttonClass: 'btn',
    buttonWidth: 'auto',
    buttonText: function(options) {
      if (options.length == 0) {
        return 'None selected <b class="caret"></b>';
      }
      else if (options.length > 6) {
        return options.length + ' selected  <b class="caret"></b>';
      }
      else {
        var selected = '';
          options.each(function() {
            selected += $(this).text() + ', ';
          });
        return selected.substr(0, selected.length -2) + '<b class="caret"></b>';
      }
    }
  });

  $(".navbar-search").submit(function(e) {
    e.preventDefault();
    $.ajax({
      type: "GET",
      url: "/locations/",
      data: {"address": $("#search_term").val()},
      success: function(data){
        map.setView([data.latitude, data.longitude], 16);
        $(".hero-unit").hide('fast');
        }
    });
  });
});
