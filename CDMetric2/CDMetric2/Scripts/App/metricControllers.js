var metricControllers = angular.module('metricControllers', ['metricService']);

metricControllers.controller('rolloutDetailsController', ['$scope', 'RolloutDetails', function ($scope, RolloutDetails) {
    var metrics = [];
    RolloutDetails.query(function (data) {
            angular.forEach(data, function (metric) {
                metrics.push(metric);
            })
        });
    $scope.rolloutDetails = metrics;
}]);

metricControllers.controller('rolloutSummaryController', ['$scope', 'RolloutSummary', function ($scope, RolloutSummary) {
    var metrics = [];
    RolloutSummary.query(function (data) {
        angular.forEach(data, function (metric) {
            metrics.push(metric);
        })
    });
    $scope.rolloutSummary = metrics;
}]);