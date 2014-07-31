var metricControllers = angular.module('metricControllers', ['metricService']);

metricControllers.controller('metricListController', ['$scope', 'Metrics', function ($scope, Metrics) {
    var metrics = [];
    Metrics.query(function (data) {
            angular.forEach(data, function (metric) {
                metrics.push(metric);
            })
        });
    $scope.metrics = metrics;
}]);