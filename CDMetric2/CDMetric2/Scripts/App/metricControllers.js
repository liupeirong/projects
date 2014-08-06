var metricControllers = angular.module('metricControllers', ['metricService']);

metricControllers.controller('metricListController', ['$scope', 'RolloutDetails', function ($scope, RolloutDetails) {
    var metrics = [];
    RolloutDetails.query(function (data) {
            angular.forEach(data, function (metric) {
                metrics.push(metric);
            })
        });
    $scope.rolloutDetails = metrics;
}]);