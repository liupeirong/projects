var mainApp = angular.module('mainApp', ['ngRoute', 'ngGrid', 'treeGrid', 'angularCharts', 'nvd3ChartDirectives', 'metricControllers', 'metricService']);

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
