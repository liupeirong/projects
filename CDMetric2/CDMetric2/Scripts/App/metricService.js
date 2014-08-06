var metricService = angular.module('metricService', ['ngResource']);

metricService.factory('RolloutDetails', ['$resource', function ($resource) {
        return $resource('/api/RolloutDetails', {}, {
            query: { method: 'GET', params: {}, isArray: true }
        });
    }
])