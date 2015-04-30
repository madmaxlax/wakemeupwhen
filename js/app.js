(function() {
	var app = angular.module('geofence', []);
	app.controller('geoController', function($scope) {
		$scope.locdata = "Loading..";
		$scope.locfound = false;
		$scope.searching = false;
		//set up google map var
		$scope.googleMap = null;
		//functiont to get the location
		this.wpid = null;

		this.geo_options = {
			enableHighAccuracy: true, //get the highest accuracy possible (on mobiles, this uses the GPS when allowed)
			maximumAge: Infinity, //gets the most recent location, regardless of when that was
			timeout: 30000
		};
		//main function that gets the user's location
		this.getLoc = function() {
			if (navigator && navigator.geolocation) {
				this.wpid = navigator.geolocation.watchPosition(this.geo_success, this.geo_error, this.geo_options);
				$scope.searching = true;
			}
		};
		this.initializeMap = function() {
			var mapOptions = {
				center: {
					lat: -34.397,
					lng: 150.644
				},
				zoom: 8
			};
			$scope.googleMap = new google.maps.Map(document.getElementById('map-canvas'),
				mapOptions);
		};
		this.geo_success = function(position) {
			//update the scope's new postion data from the new location 
			$scope.locdata = position;
			//push new info to $scope since it was changed by something angular misses
			$scope.$apply();
			//change the "heading" arrow. 
			var direction = $scope.locdata.coords.heading === null ? 0 : $scope.locdata.coords.heading;
			$("#compassarrow").css("transform", "rotate(" + direction + "deg)").css("-webkit-transform", "rotate(" + direction + "deg)").css("-mstransform", "rotate(" + direction + "deg)");
			$scope.locfound = true;
			$scope.searching = false;
			//re-center the map on the coordinates
			var googlePos = new google.maps.LatLng($scope.locdata.coords.latitude, $scope.locdata.coords.longitude);
			$scope.googleMap.setCenter(googlePos);
			//add a little box for it
			var infowindow = new google.maps.InfoWindow({
				map:$scope.googleMap,
				position: googlePos,
				content: 'Location found using HTML5.'
			});
			
		};

		this.geo_error = function(error) {
			$scope.locdata = "Sorry, no position available." + error.code;
			$scope.locfound = false;

			switch (error.code) {
				case 1:
					$scope.locdata += " you did not click 'allow' on the location permission popup";
					break;
				case 2:
					$scope.locdata += " unable to determine your locaiton.";
					break;
				case 3:
					$scope.locdata += " searching for the location timed out after " + this.geo_options.timeout / 1000 + " seconds.";
					break;
			}
			$scope.searching = false;

			$scope.$apply();
			navigator.geolocation.clearWatch(this.wpid);
		};


		//set up the google map
		//google.maps.event.addDomListener(window, 'load', this.initializeMap);
		this.initializeMap();
		//call the get location function initially
		this.getLoc();
	});
})();