(function() {
	var app = angular.module('geofence', []);
	app.controller('geoController', function($scope) {
		$scope.locdata = "Loading..";
		$scope.locfound = false;
		$scope.searching = false;
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

		this.geo_options = {
			enableHighAccuracy: true, //get the highest accuracy possible (on mobiles, this uses the GPS when allowed)
			maximumAge: Infinity, //gets the most recent location, regardless of when that was
			timeout: 30000
		};

		//functiont to get the location
		this.wpid = null;
		this.getLoc = function() {
			if (navigator && navigator.geolocation) {
				this.wpid = navigator.geolocation.watchPosition(this.geo_success, this.geo_error, this.geo_options);
				$scope.searching = true;
			}
		};
		//call the get location function initially
		this.getLoc();
	});
})();