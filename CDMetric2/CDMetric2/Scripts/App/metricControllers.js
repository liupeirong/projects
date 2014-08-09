var metricControllers = angular.module('metricControllers', ['metricService']);

metricControllers.controller('rolloutDetailsController', ['$scope', 'RolloutDetails', function ($scope, RolloutDetails) {
    $scope.mydata = [];
    $scope.filterOptions = {
        filterText: ''
    };
    RolloutDetails.query(function (data) {
            angular.forEach(data, function (metric) {
                $scope.mydata.push(metric);
            })
    });
    $scope.rolloutDetails = {
        data: 'mydata',
        filterOptions: $scope.filterOptions
    };
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