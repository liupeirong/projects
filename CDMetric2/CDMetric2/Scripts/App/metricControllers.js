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

metricControllers.controller('rolloutChartsController', ['$scope', 'RolloutDetails', function ($scope, RolloutDetails) {
    var lastChangeNumber = 0;
    var series_web = {};
    var series_caption = {};
    var series_mm = {};
    var series_feeds = {};
    
    $scope.data_web = {series: [], data: []};
    $scope.data_caption = { series: [], data: [] };
    $scope.data_mm = { series: [], data: [] };
    $scope.data_feeds = { series: [], data: [] };

    RolloutDetails.query(function (data) {
        angular.forEach(data, function (metric) {
            var duration = (metric.DurationInMin / 60);

            if (metric.ChangeNumber != lastChangeNumber) {
                var point = {};
                point.x = metric.ChangeNumber.toString();
                point.y = [];
                point.y.push(duration);
                if (metric.RolloutName.indexOf('MMServe') > -1) {
                    if (!(metric.StageName in series_mm))
                        series_mm[metric.StageName] = 0;
                    $scope.data_mm.data.push(point);
                } else if (metric.RolloutName.indexOf('caption') > -1) {
                    if (!(metric.StageName in series_caption))
                        series_caption[metric.StageName] = 0;
                    $scope.data_caption.data.push(point);
                } else if (metric.RolloutName.indexOf('Feeds') > -1) {
                    if (!(metric.StageName in series_feeds))
                        series_feeds[metric.StageName] = 0;
                    $scope.data_feeds.data.push(point);
                } else {
                    if (!(metric.StageName in series_web))
                        series_web[metric.StageName] = 0;
                    $scope.data_web.data.push(point);
                }
                lastChangeNumber = metric.ChangeNumber;
            } else {
                if (metric.RolloutName.indexOf('MMServe') > -1) {
                    if (!(metric.StageName in series_mm))
                        series_mm[metric.StageName] = 0;
                    $scope.data_mm.data[$scope.data_mm.data.length - 1].y.push(duration);
                } else if (metric.RolloutName.indexOf('caption') > -1) {
                    if (!(metric.StageName in series_caption))
                        series_caption[metric.StageName] = 0;
                    $scope.data_caption.data[$scope.data_caption.data.length - 1].y.push(duration);
                } else if (metric.RolloutName.indexOf('Feeds') > -1) {
                    if (!(metric.StageName in series_feeds))
                        series_feeds[metric.StageName] = 0;
                    $scope.data_feeds.data[$scope.data_feeds.data.length - 1].y.push(duration);
                } else {
                    if (!(metric.StageName in series_web))
                        series_web[metric.StageName] = 0;
                    $scope.data_web.data[$scope.data_web.data.length - 1].y.push(duration);
                }
            }
        });
        for (var key in series_web) {
            $scope.data_web.series.push(key);
        }
        for (var key in series_caption) {
            $scope.data_caption.series.push(key);
        }
        for (var key in series_mm) {
            $scope.data_mm.series.push(key);
        }
        for (var key in series_feeds) {
            $scope.data_feeds.series.push(key);
        }
    });

    $scope.config_web = {
        title: 'Web stage time in hours',
        tooltips: true,
        labels: false,
        mouseover: function () { },
        mouseout: function () { },
        click: function () { },
        legend: {
            display: true,
            position: 'right'
        }
    };
    $scope.config_caption = {
        title: 'Caption stage time in hours',
        tooltips: true,
        labels: false,
        mouseover: function () { },
        mouseout: function () { },
        click: function () { },
        legend: {
            display: true,
            position: 'right'
        }
    };
    $scope.config_mm = {
        title: 'MultiMedia stage time in hours',
        tooltips: true,
        labels: false,
        mouseover: function () { },
        mouseout: function () { },
        click: function () { },
        legend: {
            display: true,
            position: 'right'
        }
    };
    $scope.config_feeds = {
        title: 'Feeds stage time in hours',
        tooltips: true,
        labels: false,
        mouseover: function () { },
        mouseout: function () { },
        click: function () { },
        legend: {
            display: true,
            position: 'right'
        }
    };
}]);