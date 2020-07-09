var init;
var map;
var markers = [];
var current;
function initMap() {
   current = new google.maps.LatLng(44.9727, -93.23540000000003);
   map = new google.maps.Map(document.getElementById('map'), {
    mapTypeControl: false,
    center: current,
    zoom: 14.5,
  gestureHandling: 'greedy',
  });
  new AutocompleteDirectionsHandler(map); //puts the direction between start and end location
  setMarkers(map); //put markers on the map
var input = document.getElementById('search');
var searchBox = new google.maps.places.SearchBox(input);
<!-- map.controls[google.maps.ControlPosition.TOP_RIGHT].push(input); -->
// Bias the SearchBox results towards current map's viewport.
map.addListener('bounds_changed', function() {
  searchBox.setBounds(map.getBounds());
});

//var marker;
// Listen for the event fired when the user selects a prediction and retrieve
// more details for that place.
searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();
    if (places.length == 0) {
    return;
    }
    // Clear out the old markers.
    markers.forEach(function(marker) {
    marker.setMap(null);
    });
  
    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
    if (!place.geometry) {
      console.log("Returned place contains no geometry");
      return;
    }
    var icon = {
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
    };
    // Create a marker for each place.
    markers.push(new google.maps.Marker({
      map: map,
      icon: icon,
      title: place.name,
      position: place.geometry.location,
    }));
    if (place.geometry.viewport) {
      // Only geocodes have viewport.
      bounds.union(place.geometry.viewport);
    } else {
      bounds.extend(place.geometry.location);
    }
    });
    map.fitBounds(bounds);
  });
  
  var infoWindow = new google.maps.InfoWindow;
  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
    var pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    infoWindow.open(map);
    map.setCenter(pos);
    }, function() {
    handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
              'Error: The Geolocation service failed.' :
              'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}
function AutocompleteDirectionsHandler(map) {
  this.map = map;
  this.originPlaceId = null;
  this.destinationPlaceId = null;
  this.travelMode = 'DRIVING';
  this.directionsService = new google.maps.DirectionsService;
  this.directionsDisplay = new google.maps.DirectionsRenderer;
  this.directionsDisplay.setMap(map);
  this.directionsDisplay.setPanel(document.getElementById('left-panel'));
  var originInput = document.getElementById('origin');
  var destinationInput = document.getElementById('destination');
  var modeSelector = document.getElementById('mode-selector');
  var originAutocomplete = new google.maps.places.Autocomplete(originInput);
  // Specify just the place data fields that you need.
  originAutocomplete.setFields(['place_id']);
  var destinationAutocomplete =
      new google.maps.places.Autocomplete(destinationInput);
  // Specify just the place data fields that you need.
  destinationAutocomplete.setFields(['place_id']);
  this.setupClickListener('walking-mode', 'WALKING');
  this.setupClickListener('transit-mode', 'TRANSIT');
  this.setupClickListener('driving-mode', 'DRIVING');
    this.setupClickListener('bike-mode', 'BICYCLING');
  this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
  this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');
}

// Sets a listener on a radio button to change the filter type on Places
// Autocomplete.
AutocompleteDirectionsHandler.prototype.setupClickListener = function(
    id, mode) {
  var radioButton = document.getElementById(id);
  var me = this;
  radioButton.addEventListener('click', function() {
    me.travelMode = mode;
    me.route();
  });
};
AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function(
    autocomplete, mode) {
  var me = this;
  autocomplete.bindTo('bounds', this.map);
  autocomplete.addListener('place_changed', function() {
    var place = autocomplete.getPlace();
    if (!place.place_id) {
      window.alert('Please select an option from the dropdown list.');
      return;
    }
    if (mode === 'ORIG') {
      me.originPlaceId = place.place_id;
    } else {
      me.destinationPlaceId = place.place_id;
    }
    me.route();
  });
};
AutocompleteDirectionsHandler.prototype.route = function() {
  if (!this.originPlaceId || !this.destinationPlaceId) {
    return;
  }
  var me = this;
  this.directionsService.route(
      {
        origin: {'placeId': this.originPlaceId},
        destination: {'placeId': this.destinationPlaceId},
        travelMode: this.travelMode
      },
      function(response, status) {
        if (status === 'OK') {
          me.directionsDisplay.setDirections(response);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });
};
        var beaches = [
        ['Keller Hall', 44.974536, -93.232237, 1],
        ['Mechanical Engineering', 44.975063,  -93.233370, 2],
        ['Rec Center', 44.975673, -93.2299542, 3],
        ['Admuson Hall',44.9738915, -93.2330481,4]
      ];
function setMarkers(map) {
        // Adds markers to the map.
        // Marker sizes are expressed as a Size of X,Y where the origin of the image
        // (0,0) is located in the top left of the image.
        // Origins, anchor positions and coordinates of the marker increase in the X
        // direction to the right and in the Y direction down.
        var image = {
          
          // This marker is 20 pixels wide by 32 pixels high.
          size: new google.maps.Size(20, 32),
          // The origin for this image is (0, 0).
          origin: new google.maps.Point(0, 0),
          // The anchor for this image is the base of the flagpole at (0, 32).
          anchor: new google.maps.Point(0, 32)
        };
        // Shapes define the clickable region of the icon. The type defines an HTML
        // <area> element 'poly' which traces out a polygon as a series of X,Y points.
        // The final coordinate closes the poly by connecting to the first coordinate.
        var shape = {
          coords: [1, 1, 1, 20, 18, 20, 18, 1],
          type: 'poly'
        };
        for (var i = 0; i < beaches.length; i++) {
          var beach = beaches[i];
          var marker = new google.maps.Marker({
            position: {lat: beach[1], lng: beach[2]},
            map: map,
            icon: image,
            shape: shape,
            title: beach[0],
            zIndex: beach[3]
          });
        }
      }

var iconImg; 
var pictures = [  "keller", "coffman","lab", "me", "rec", "ad","free"];
var descriptions = [ "a picture of coffman", 
   "a picture of clock", "a picture of keller", 
   "a picture of lab", "a picture of mechanical engineering building", 
   "a picture of rec center", "a picture of admuson hall" ];

var init; 
var map;
var geocoder;
var index=0;
var infoWindow;


function initialize(){
   iconImg=document.getElementById("bigPic"); 
   geocoder = new google.maps.Geocoder();
   setUp();

}

function pickImage()
{  
   index=index%7;
   iconImg.setAttribute( "src", pictures[ index ] + ".JPG" );
   iconImg.setAttribute( "alt", descriptions[ index ] );
   index=index+1;
} 

function start()
{
  return setInterval(pickImage, 1000);
}

function stop()
{
  return clearInterval(init)
}


function unique(a) {
   return Array.from(new Set(a));
}

function setUp() {
  var location = document.getElementsByClassName("address");
  var i;
  var z=document.getElementById("dummy")

  var arr=[];

  for (i = 0; i < location.length; i++) {
      arr.push(location[i].textContent)
  }
  arr=unique(arr);
  for (i = 0; i < arr.length; i++) {
    geocodeAddress(geocoder, map,arr[i]);
  }
}

   function searchPlace() {
   
     var sel=document.getElementById('place');
   var rad=document.getElementById('radius');
   var choice_type = sel.options[sel.selectedIndex].value;
   var choice_rad = rad.value;

   if (choice_type=="others")
   {
      var alter=document.getElementById('other_place');
      choice_type=alter.value;
   }

   var request = {
        location: current ,
        radius: choice_rad,
        type: choice_type
      };

  // Clear out the old markers.
  markers.forEach(function(marker) {
            marker.setMap(null);
          });
  markers = [];

  var service = new google.maps.places.PlacesService(map);
 
  service.nearbySearch(request, callback);
}



   function checkOthers(val){
    var element=document.getElementById('other_place');
    if(val=='others')
      element.disabled = false;
    else  
      element.disabled = true;
   }

 function callback(results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          var place = results[i];
          createMarker(results[i]);
        }
      }
    }

  function createMarker(place) {
        console.log(typeof (place.name));
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location
          //content: place.name
        });

        markers.push(marker);
        infoWindow = new google.maps.InfoWindow;
        //   
        google.maps.event.addListener(marker, 'click', function () {
               
                infoWindow.setContent(place.name);
                infoWindow.open(map, marker);
            });


        /*
        google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent(place.name);
          infowindow.open(map, this);
        });
        */
      }
  function geocodeAddress(geocoder, resultsMap,address) {
            //var address = document.getElementById('address').value;
            geocoder.geocode({'address': address}, function(results, status) {
              if (status === 'OK') {
                resultsMap.setCenter(results[0].geometry.location);
                var marker = new google.maps.Marker({
                  map: resultsMap,
                  position: results[0].geometry.location,
                  icon:"images/icon.png",
                  content:"hello"

                });

                markers.push(marker);
                infoWindow = new google.maps.InfoWindow;
                //   
                google.maps.event.addListener(marker, 'click', function () {
                       
                        infoWindow.setContent(results[0].name);
                        infoWindow.open(map, marker);
                    });


              } else {
                alert('Geocode was not successful for the following reason: ' + status);
              }
            });
       }


window.addEventListener( "load", initialize);