var metricService = angular.module('metricService', ['ngResource']);

metricService.factory('RolloutDetails', ['$resource', function ($resource) {
        return $resource('/api/RolloutDetails', {}, {
            query: { method: 'GET', params: {}, isArray: true }
        });
    }
])

metricService.factory('RolloutSummary', ['$resource', function ($resource) {
        return $resource('/api/RolloutSummary', {}, {
            query: { method: 'GET', params: {}, isArray: true }
        });
    }
])