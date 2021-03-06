﻿var mainApp = angular.module('mainApp', ['ngRoute', 'ngGrid', 'treeGrid', 'nvd3ChartDirectives', 'metricControllers', 'metricService']);

mainApp.config([
    '$routeProvider',
    function ($routeProvider) {
        $routeProvider.
        when('/deployments/summary', {
            templateUrl: '/Scripts/app/Views/rolloutsummary.html',
            controller: 'rolloutSummaryController'
        }).
        when('/deployments/details', {
            templateUrl: '/Scripts/app/Views/rolloutdetails.html',
            controller: 'rolloutDetailsController'
        }).
        when('/deployments/charts', {
            templateUrl: '/Scripts/app/Views/rolloutcharts.html',
            controller: 'rolloutChartsController'
        }).
        otherwise({
            redirectTo: '/deployments/summary'
        });
    }
]);

mainApp.controller('navController', ['$scope', '$location', function ($scope, $location) {
    $scope.isActive = function (viewLocation) {
        return $location.path().indexOf(viewLocation) == 0;
    };
}]);

mainApp.controller('globalCfgController', ['$scope', 'globalCfgService', function ($scope, globalCfgService) {
    $scope.releaseChoices = globalCfgService.getReleaseChoices();
    $scope.selectedReleaseChoice = globalCfgService.getLastNChoice();
    $scope.saveSelection = function () {
        globalCfgService.saveLastNChoice($scope.selectedReleaseChoice);
        $scope.$broadcast('cfgChange');
    }
}]);

mainApp.factory('globalCfgService', function () {
    var releaseChoices = [
        { name: 'last 10 releases', value: 10 },
        { name: 'last 20 releases', value: 20 },
        { name: 'all releases', value: -1 }
    ];
    var lastNChoice = releaseChoices[0];

    return {
        saveLastNChoice: function (data) {
            lastNChoice = data;
        },
        getLastNReleases: function () {
            return lastNChoice.value;
        },
        getLastNChoice: function () {
            return lastNChoice;
        },
        getReleaseChoices: function () {
            return releaseChoices;
        }
    }
});