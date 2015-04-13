(function() {
	var app = angular.module('geofence', ['geolocation']);
	app.controller('geoController', function($scope, geolocation) {
		$scope.locdata = "Loading..";
		geolocation.getLocation().then(function(data) {
			$scope.locdata = data;
/* 			$scope.coords = {
				lat: data.coords.latitude,
				long: data.coords.longitude
			};  */
		});
	});
})();