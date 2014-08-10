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
    var tree;
    $scope.my_tree = tree = {};
    $scope.expanding_property = "RolloutName";
    $scope.col_defs = [
        { field: "StageName" },
        { field: "StartTime" },
        { field: "EndTime" },
        { field: "DurationInMin" }
    ];
    $scope.tree_data = [];
    RolloutSummary.query(function (data) {
        angular.forEach(data, function (metric) {
            $scope.tree_data.push(metric);
        });
    });
}]);