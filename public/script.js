/**
 * Created by Joey on 7/18/2017.
 */

// script.js
// create the module and name it travelWeb & include ngRoute for all routing needs
var travelWeb = angular.module('travelWeb', ['ngRoute']);

// configure our routes
travelWeb.config(function($routeProvider) {
    $routeProvider

        // route for the home page
        .when('/home', {
            templateUrl : 'home.html',
            controller  : 'mainController'
        })

        // route for the about page
        .when('/favourite', {
            templateUrl : 'favourite.html',
            controller  : 'favouriteController'
        })

        // route for the contact page
        .when('/contact', {
            templateUrl : 'contact.html',
            controller  : 'contactController'
        })

        .otherwise({
            redirectTo: 'home'
        })
});

// create the controller and display Angular's $scope
travelWeb.controller('mainController', function($scope, $http) {
    // create message to display in the view
    $scope.message = 'Use search bar below to search places';

    $scope.results = [];

    $scope.init = function() {
        var map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 35.7223637, lng: 139.7345043},
            zoom: 11
        });
        var card = document.getElementById('pac-card');
        var input = document.getElementById('searchTerm');

        var infowindow = new google.maps.InfoWindow();
        var infowindowContent = document.getElementById('infowindow-content');
        var places_markers = []; // for individual markers

        infowindow.setContent(infowindowContent);

        var marker = new google.maps.Marker({
            map: map,
            anchorPoint: new google.maps.Point(0, -29)
        });

        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', map);

        autocomplete.addListener('place_changed', function () {
            infowindow.close();
            marker.setVisible(false);

            var place = autocomplete.getPlace();
            var place_marker;

            if (!place.geometry) {
                // User entered the name of a Place that was not suggested and
                // pressed the Enter key, or the Place Details request failed.
                window.alert("No details available for input: '" + place.name + "'");
                return;
            }

            // If the place has a geometry, then present it on a map.
            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
            } else {
                map.setCenter(place.geometry.location);
                map.setZoom(17);
            }
            marker.setPosition(place.geometry.location);
            marker.setVisible(true);

            var address = '';
            if (place.address_components) {
                address = [
                    (place.address_components[0] && place.address_components[0].short_name || ''),
                    (place.address_components[1] && place.address_components[1].short_name || ''),
                    (place.address_components[2] && place.address_components[2].short_name || '')
                ].join(' ');
            }

            infowindowContent.children['place-icon'].src = place.icon;
            infowindowContent.children['place-name'].textContent = place.name;
            infowindowContent.children['place-address'].textContent = address;
            infowindow.open(map, marker);

            // contact server get nearby places data based on central location(marker)
            $http({
                url : 'searchTerm',
                method: 'POST',
                header: {'Content-Type': 'application/json'},
                data: {lat: place.geometry.location.lat(), long: place.geometry.location.lng()}

            }).then(function successCallback(res) {
                $scope.results = res.data;

                // add markers
                for(var i = 0; i < $scope.results.length; i++) {
                    place_marker = new google.maps.Marker({
                        position: new google.maps.LatLng(res.data[i].latitude, res.data[i].longitude),
                        map: map
                    });

                    places_markers.push(place_marker);
                }
            });

        });
    }
});

travelWeb.controller('favouriteController', function($scope) {
    $scope.message = 'Favourite places at below';
});

travelWeb.controller('contactController', function($scope) {
    $scope.message = 'Drop us message for any question!';
});