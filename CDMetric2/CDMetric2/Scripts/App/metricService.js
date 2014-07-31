var metricService = angular.module('metricService', ['ngResource']);

metricService.factory('Metrics', ['$resource', function ($resource) {
        return $resource('/api/Metric', {}, {
            query: { method: 'GET', params: {}, isArray: true }
        });
    }
])