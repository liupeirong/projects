var mainApp = angular.module('mainApp', ['ngRoute', 'ngGrid', 'treeGrid', 'nvd3ChartDirectives', 'metricControllers', 'metricService']);

mainApp.config([
    '$routeProvider',
    function ($routeProvider) {
        $routeProvider.
        when('/rolloutsummary', {
            templateUrl: '/Scripts/app/Views/rolloutsummary.html',
            controller: 'rolloutSummaryController'
        }).
        when('/rolloutdetails', {
            templateUrl: '/Scripts/app/Views/rolloutdetails.html',
            controller: 'rolloutDetailsController'
        }).
        when('/rolloutcharts', {
            templateUrl: '/Scripts/app/Views/rolloutcharts.html',
            controller: 'rolloutChartsController'
        }).
        otherwise({
            redirectTo: '/rolloutsummary'
        });
    }
]);

mainApp.controller('globalCfgController', ['$scope', 'globalCfgService', function ($scope, globalCfgService) {
    $scope.releaseChoices = [
        {name:'last 10 releases', value:10},
        {name:'last 20 releases', value:20},
        {name:'all releases', value:-1}
    ];
    $scope.selectedReleaseChoice = $scope.releaseChoices[0];
    globalCfgService.saveLastNReleases($scope.selectedReleaseChoice.value);
    $scope.saveSelection = function () {
        globalCfgService.saveLastNReleases($scope.selectedReleaseChoice.value);
        $scope.$broadcast('cfgChange');
    }
}]);

mainApp.factory('globalCfgService', function () {
    var lastNReleases = -1;

    return {
        saveLastNReleases: function (data) {
            lastNReleases = data;
            console.log("lastNRelease:" + lastNReleases);
        },
        getLastNReleases: function () {
            return lastNReleases;
        }
    }
});