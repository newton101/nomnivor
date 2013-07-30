$(document).ready(function() {

  var clientid = "F2TFZIIG0IVCY4UU3XZPMMK0YG5XKL5LDPSGWO3KRZWUD2GT";
  var clientsec = "EKTERA4XDUW5M1WLU4NT2V3ARPAQTHL4P1AENIHIZ1ZJHDVJ";

  // $("#filterBar").hide();
  $("#resultsContainer").hide();
  $(".navbar-form").hide();

// display map

  var venues = [];


// create map
  createMap([51.5, -0.08],13);
// b&w map: 4l7djmvo
  function createMap(ll, zoom) {
    map = L.mapbox.map('map', 'examples.map-uci7ul8p').setView(ll, zoom);
  }

//create map $$$$ end
// validation of restaurant form

  $('#submit').click(function (e) {
    if (nameValidation() == false ) {
      e.preventDefault();
      alert("Please enter a valid name");
    }
    else if (descriptionValidation() == false) {
      e.preventDefault();
      alert("Please enter a valid description");
    }
    else if (dietValidation() == false) {
      e.preventDefault();
      alert("Please select atleast one diet");
    };
  });

  function nameValidation() {
    if ( ($('#name_auto_complete').val().length) <= 3) {
      return false;
    }
    else if ($.isNumeric($('#latitude-field').val()) == false) {
      return false;
    }
  }

  function descriptionValidation() {
      if ( ($('#description').val().length) <= 6) {
        return false;
      }
    }

  function dietValidation() {
    var boxes = $(':checked');
    if ( boxes.length == 0) {
        return false;
    }
  }

// validation of restaurant form $$$$ end
// add markers and filter them

  // $.ajax({
  //   type: "GET",
  //   url: "/restaurants/",
  //   data: $(this).serialize(),
  //   success: function(data){
  //     var collection = createGeoJsonCollection(data);
  //        group.clearLayers();
  //        group.addData(collection);
  //        // renderAllPhotos(data);
  //     ;}
  // });

  function renderAllPhotos(restaurants){
    var i = getVenueIds(restaurants);

    $.each(restaurants, function(index, restaurant){
        createRestaurantCard(restaurant.name, restaurant.description);
        getVenuePhotos(restaurant.venue_id);

    });

    setDataIdsAttribute(i);
  }

  function getVenueIds(restaurants) {
    var ids = []
    $.each(restaurants, function(index, restaurant){
        ids.push(restaurant.venue_id);
    });
    return ids;
  }

  function setDataIdsAttribute(array) {
    $.each(array, function(numi, num){
        $('#results .card').each(function(ei, e){
            if (numi == ei && $(e).attr('data-id') == "") {
            $(e).attr('data-id', num);
            }
        });
    });
  }

  // needs major refactoring and now needs
  // to prevent duplicate cards being created for same
  // venue check for data-id attribute match
  function createRestaurantCard(name, description) {
      var card = document.createElement('li');
      card.className = "card";
      card.setAttribute('data-id', "");

      var restaurantBlock = document.createElement('div');
      restaurantBlock.className = "restaurantBlock";
      $(restaurantBlock).append(name);
      card.appendChild(restaurantBlock);

      var photoContainer = document.createElement('div');
      photoContainer.className = "photoContainer";
      card.appendChild(photoContainer);



      var cardDetails = document.createElement('div');
      cardDetails.className = "cardDetails";
      $(cardDetails).append(description);
      card.appendChild(cardDetails);

      $(".recommendationList").append(card);
  }


  function getVenuePhotos(venue_id) {
    $.get("https://api.foursquare.com/v2/venues/"+venue_id+"/photos?&client_id=" + clientid +"&client_secret="+clientsec, function(json){
        if (json.response.photos.summary != "No photos") {
            first_photo = json.response.photos.groups[1].items[1];

            var img = document.createElement('img');
            img.className = 'photo';
            img.id = venue_id;
            img.src = first_photo.url;
            img.width = '100';
            img.height = '100';


            var t = document.getElementById(venue_id);
            var td = $(t).attr('id');
            console.log(t);
            console.log(td);
            if (t == null && td != venue_id) {
              $('#results .card[data-id='+venue_id+'] > .photoContainer').append(img);
            }
        }
    });
  }



  function createGeoJsonCollection(array){
    json_array = []
    $.each(array, function(index, element){
      var feature = {type: "Feature",
        geometry: {type: "Point", coordinates: [element.longitude, element.latitude]},
        properties: { "title": element.name, "description": element.description, "diets": element.diets}}
        json_array.push(feature);
      });
    return json_array;
  };


// add popup content $$$$ end

  var group = L.geoJson(null, {
    style: null,
    onEachFeature: function (feature, layer) {
      layer.bindPopup("<p>"+"<strong>"+feature.properties.title+"</strong></p><p>"+feature.properties.description+"</p><p>"+ eachDietName(feature.properties.diets)+"</p>");
    }
  }).addTo(map);

    group.on('mouseover', function(e) {
       e.layer.openPopup();
    });

    group.on('mouseout', function(e) {
       e.layer.closePopup();
    });

  function eachDietName(diets){
    var dietsString = ''
    $.each(diets, function(index, diet){
         dietsString += diet.name + ', ';
    });
    return dietsString.substring(0, dietsString.lastIndexOf(', '));
  }

  function setMarkers(data) {
    var collection = createGeoJsonCollection(data);
           group.clearLayers();
           group.addData(collection);
  }

  // filter diets

  $(".diets-filter").submit(function(e){
    e.preventDefault();
    $.ajax({
      type: "GET",
      url: "/restaurants/",
      data: $(this).serialize(),
      success: function(data){
        setMarkers(data);
        renderAllPhotos(data);


        }
    });
  });

  // end filter diets

// show diets $$$$ end
// foursquare venues



 $('#name_auto_complete').keyup(function() {callFoursquareForTypeahead();
  });

  $('#name_auto_complete').blur(function() {
    fillLatLngandId();
  });
  // found out what source does
  function callFoursquareForTypeahead() {
    $('#name_auto_complete').typeahead({
        minLength: 3,
        source: function(query, process) {
            foursquareQuery(query);
            process(venueNames());
        }
    });
  }
  // find out what _map does
  function venueNames() {
    return _.map(venues, function(venue) { return displayName(venue) });
  }

  function displayName(venue) {
    return venue.name + " (" + venue.location.address + ")"
  }

  function venuesFound(minivenues) {
    venues = minivenues;
  }

  function foursquareQuery(query) {
    var urlString = "https://api.foursquare.com/v2/venues/suggestCompletion?ll="+current_location()+"&client_id=" + clientid +"&client_secret="+clientsec +"&radius=1000";
    $.get(urlString, {query: $('#name_auto_complete').val()}, function(json) {
      venuesFound(json.response.minivenues)
    });
  };

  function fillLatLngandId() {
    venueLatLngandId(venues);
  }
  // what does this funtion do
  function venueLatLngandId(venues) {
    _.each(venues, function(venue){
      if (displayName(venue) == $('#name_auto_complete').val()) {
        $("#latitude-field").val(venue.location.lat);
        $("#longitude-field").val(venue.location.lng);
        $("#venue-id").val(venue.id);
      };
    })
  }

// foursquare venues $$$$ end
// geolocation for find me

  $(".find_me").click(function() {
    map.locate();
    map.on('locationfound', function(e) {
      map.setView(e.latlng, 15);
    });
    $(".landing").hide('fast');
    // $("#filterBar").show('slow');
    $("#resultsContainer").show('slow');
  });

  function current_location() {
    var current_latlng = [map.getCenter().lat,map.getCenter().lng];
    return String(current_latlng);
  };

// geolocate for me $$$$ end
// close hero unit

  $(".close").click(function() {
    $(".landing").hide('fast');
  });

// close hero unit $$$$ end
// find location finder


  // Location find automcomplete using Google Maps API
  var input = document.getElementById('search_term');
    autocomplete = new google.maps.places.Autocomplete(input);

   var input = document.getElementById('bar_search_term');
    autocomplete = new google.maps.places.Autocomplete(input);

  //Automcomplete using Gmaps $$$$ end

    $('.multiselect').multiselect({
      buttonClass: 'btn',
      buttonWidth: 'auto',
      buttonContainer: '<div class="btn-group" />',
      maxHeight: 150,
      buttonText: function(options) {
        if (options.length == 0) {
          return 'None selected <b class="caret"></b>';
        }
        else if (options.length > 3) {
          return options.length + ' selected  <b class="caret"></b>';
        }
        else {
          var selected = '';
          options.each(function() {
            selected += $(this).text() + ', ';
          });
          return selected.substr(0, selected.length -2) + ' <b class="caret"></b>';
        }
      }
    });


  // Actual search using geolocate GEM (see controller)

  $(".landing-search").submit(function(e) {
    e.preventDefault();
    $.ajax({
      type: "GET",
      url: "/locations/",
      data: {"address": $("#bar_search_term").val(), "diets": $('.multiselect').val()},
      success: function(data){
        var restaurants = data[1];
        var location = data[0];

        map.setView([location.latitude, location.longitude], 10);

        $("#filterBar-side").prepend(foundMSG(restaurants));
        setMarkers(restaurants);
        renderAllPhotos(restaurants);

        $(".landing").hide('fast');
        $(".navbar-form").show('fast');
        $("#resultsContainer").show('fast');

        }

    });
  });

  //  make array of checkbox values
  //  function checkedDiets() {
  //    var allVals = [];
  //    $(':checked').each(function(c) {
  //     console.log(c);
  //      allVals.push($(this).val());
  //    });
  //    return allVals;
  // }

  function foundMSG(collection){
    var para=document.createElement("p");
    para.className = "found-msg"
    var node=document.createTextNode(collection.length+ " restaurants found");
    para.appendChild(node);
    return para;
  }

  $(".navbar-form").submit(function(e) {
    e.preventDefault();
    $.ajax({
      type: "GET",
      url: "/locations/",
      data: {"address": $("#search_term").val()},
      success: function(data){

        map.setView([data.latitude, data.longitude], 15);

        $(".landing").hide('fast');

        // $("#filterBar").show('slow');
        $("#resultsContainer").show('slow');
        // renderAllPhotos(data);

        }
    });
  });

  // location finder $$$$ end
});
