var mainApp = angular.module('mainApp', ['ngRoute', 'ngGrid', 'treeGrid', 'metricControllers', 'metricService']);

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
        otherwise({
            redirectTo: '/rolloutsummary'
        });
    }
]);
