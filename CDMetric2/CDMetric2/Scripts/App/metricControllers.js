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
    var stages_web = {};
    var stages_caption = {};
    var stages_mm = {};
    var stages_feeds = {};

    var rollouts_web = {};
    var rollouts_caption = {};
    var rollouts_mm = {};
    var rollouts_feeds = {};
    
    $scope.data_web = {series: [], data: []};
    $scope.data_caption = { series: [], data: [] };
    $scope.data_mm = { series: [], data: [] };
    $scope.data_feeds = { series: [], data: [] };

    RolloutDetails.query(function (data) {
        angular.forEach(data, function (metric) {
            var duration = (metric.DurationInMin / 60);
            var changeNumber = metric.ChangeNumber.toString();

            //create stages data structure like this: 
            //{"stage1": {"changeNumber1": duration,
            //            "changeNumber2": duration
            //           },
            // "stage2": {"changeNumber2": duration,
            //            "changeNumber1": duration
            //           };
            //}
            //create rollouts as an associative array like this, used as a dictionary keys:
            //{ "changeNumber1":0,
            //  "changeNumber2":0
            //}
            if (metric.RolloutName.indexOf('MMServe') > -1) {
                if (!(metric.StageName in stages_mm))
                    stages_mm[metric.StageName] = {};
                if (!(changeNumber in rollouts_mm))
                    rollouts_mm[changeNumber] = 0;
                stages_mm[metric.StageName][changeNumber] = duration;
            } else if (metric.RolloutName.indexOf('caption') > -1) {
                if (!(metric.StageName in stages_caption))
                    stages_caption[metric.StageName] = {};
                if (!(changeNumber in rollouts_caption))
                    rollouts_caption[changeNumber] = 0;
                stages_caption[metric.StageName][changeNumber] = duration;
            } else if (metric.RolloutName.indexOf('Feeds') > -1) {
                if (!(metric.StageName in stages_feeds))
                    stages_feeds[metric.StageName] = {};
                if (!(changeNumber in rollouts_feeds))
                    rollouts_feeds[changeNumber] = 0;
                stages_feeds[metric.StageName][changeNumber] = duration;
            } else {
                if (!(metric.StageName in stages_web))
                    stages_web[metric.StageName] = {};
                if (!(changeNumber in rollouts_web))
                    rollouts_web[changeNumber] = 0;
                stages_web[metric.StageName][changeNumber] = duration;
            }
        });
        db2graph(stages_web, rollouts_web, $scope.data_web);
        db2graph(stages_caption, rollouts_caption, $scope.data_caption);
        db2graph(stages_mm, rollouts_mm, $scope.data_mm);
        db2graph(stages_feeds, rollouts_feeds, $scope.data_feeds);
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

//convert the stages and rollouts data structure to $scope.data_ data structure like this:
//{
//  series: ["stage1", "stage2"...],
//  data:[
//         {x: "changeNumber1", y: [stage1Duration, stage2Duration...]},
//         {x: "changeNumber2", y: [stage2Duration, stage2Duration...]}
//       ]
//}
function db2graph(curstages, currollouts, scopedata) {
    for (var key in curstages) {
        scopedata.series.push(key);
    }
    scopedata.series.sort();
    var rollouts = [];
    for (var key in currollouts) {
        rollouts.push(key);
    }
    rollouts.sort();

    for (var k = 0; k < rollouts.length; ++k) {
        var rollout = rollouts[k];
        var point = {};
        point.x = rollout;
        point.y = [];
        var stages = scopedata.series.length;
        for (var i = 0; i < stages; ++i) {
            var stage = scopedata.series[i];
            var rolloutsInStage = curstages[stage];
            var duration = (rollout in rolloutsInStage) ? rolloutsInStage[rollout] : 0;
            if (duration == null) duration = 0;
            point.y.push(duration);
        }
        scopedata.data.push(point);
    }
};
