var metricControllers = angular.module('metricControllers', ['metricService']);

metricControllers.controller('rolloutDetailsController', ['$scope', 'RolloutDetails', 'globalCfgService', function ($scope, RolloutDetails, globalCfgService) {
    $scope.mydata = [];
    $scope.filterOptions = {
        filterText: ''
    };
    $scope.rolloutDetails = {
        data: 'mydata',
        filterOptions: $scope.filterOptions
    };
    $scope.buildTable = function () {
        $scope.lastNReleases = globalCfgService.getLastNReleases();
        RolloutDetails.query({ n: $scope.lastNReleases }, function (data) {
            angular.forEach(data, function (metric) {
                $scope.mydata.push(metric);
            })
        });
    };
    $scope.$on('cfgChange', function (event, data) {
        $scope.buildTable();
    });
    $scope.buildTable();
}]);

metricControllers.controller('rolloutSummaryController', ['$scope', 'RolloutSummary', 'globalCfgService', function ($scope, RolloutSummary, globalCfgService) {
    var tree;
    $scope.my_tree = tree = {};
    $scope.expanding_property = "RolloutName";
    $scope.col_defs = [
        { field: "StageName" },
        { field: "StartTime" },
        { field: "EndTime" },
        { field: "DurationInMin" }
    ];
    $scope.buildTree = function () {
        $scope.tree_data = [];
        $scope.lastNReleases = globalCfgService.getLastNReleases();
        RolloutSummary.query({ n: $scope.lastNReleases }, function (data) {
            angular.forEach(data, function (metric) {
                $scope.tree_data.push(metric);
            });
        });
    }
    $scope.$on('cfgChange', function (event, data) {
        $scope.buildTree();
    });
    $scope.buildTree();
}]);

metricControllers.controller('rolloutChartsController', ['$scope', 'RolloutDetails', 'RolloutSummary', 'globalCfgService',
    function ($scope, RolloutDetails, RolloutSummary, globalCfgService) {
        $scope.buildCharts = function () {
            var stages_web = {};
            var stages_caption = {};
            var stages_mm = {};
            var stages_feeds = {};

            var rollouts_web = {};
            var rollouts_caption = {};
            var rollouts_mm = {};
            var rollouts_feeds = {};

            var rollout_duration_web = {};
            var rollout_duration_caption = {};
            var rollout_duration_mm = {};
            var rollout_duration_feeds = {};

            $scope.data_web = [];
            $scope.data_caption = [];
            $scope.data_mm = [];
            $scope.data_feeds = [];

            $scope.data_web_total = [];
            $scope.data_caption_total = [];
            $scope.data_mm_total = [];
            $scope.data_feeds_total = [];

            $scope.lastNReleases = globalCfgService.getLastNReleases();
            RolloutDetails.query({ n: $scope.lastNReleases }, function (data) {
                angular.forEach(data, function (metric) {
                    var duration = ((metric.DurationInMin / 60).toFixed(1)) / 1;
                    var changeNumber = metric.ChangeNumber.toString();

                    //create stages data structure like this: 
                    //{"stage1": {"changeNumber1": duration,
                    //            "changeNumber2": duration
                    //           },
                    // "stage2": {"changeNumber2": duration,
                    //            "changeNumber1": duration
                    //           };
                    //}
                    if (metric.RolloutName.indexOf('MMServe') > -1) {
                        if (!(metric.StageName in stages_mm)) {
                            stages_mm[metric.StageName] = {};
                        }
                        stages_mm[metric.StageName][changeNumber] = duration;
                    } else if (metric.RolloutName.indexOf('caption') > -1) {
                        if (!(metric.StageName in stages_caption)) {
                            stages_caption[metric.StageName] = {};
                        }
                        stages_caption[metric.StageName][changeNumber] = duration;
                    } else if (metric.RolloutName.indexOf('Feeds') > -1) {
                        if (!(metric.StageName in stages_feeds)) {
                            stages_feeds[metric.StageName] = {};
                        }
                        stages_feeds[metric.StageName][changeNumber] = duration;
                    } else {
                        if (!(metric.StageName in stages_web)) {
                            stages_web[metric.StageName] = {};
                        }
                        stages_web[metric.StageName][changeNumber] = duration;
                    }
                });

                RolloutSummary.query({ n: $scope.lastNReleases }, function (data) {
                    angular.forEach(data, function (metric) {
                        var duration = ((metric.DurationInMin / 60).toFixed(1)) / 1;
                        var changeNumber = metric.ChangeNumber.toString();
                        //create rollouts as an associative array like this, used as a dictionary keys:
                        //{ "startTime1":changeNumber1,
                        //  "startTime2":changeNumber2
                        //}
                        if (metric.RolloutName.indexOf('MMServe') > -1) {
                            rollout_duration_mm[changeNumber] = duration;
                            if (!(metric.StartTime in rollouts_mm))
                                rollouts_mm[metric.StartTime] = changeNumber;
                        } else if (metric.RolloutName.indexOf('caption') > -1) {
                            rollout_duration_caption[changeNumber] = duration;
                            if (!(metric.StartTime in rollouts_caption))
                                rollouts_caption[metric.StartTime] = changeNumber;
                        } else if (metric.RolloutName.indexOf('Feeds') > -1) {
                            rollout_duration_feeds[changeNumber] = duration;
                            if (!(metric.StartTime in rollouts_feeds))
                                rollouts_feeds[metric.StartTime] = changeNumber;
                        } else {
                            rollout_duration_web[changeNumber] = duration;
                            if (!(metric.StartTime in rollouts_web))
                                rollouts_web[metric.StartTime] = changeNumber;
                        }
                    });

                    db2d3(stages_web, rollouts_web, rollout_duration_web, $scope.data_web, $scope.data_web_total);
                    db2d3(stages_caption, rollouts_caption, rollout_duration_caption, $scope.data_caption, $scope.data_caption_total);
                    db2d3(stages_mm, rollouts_mm, rollout_duration_mm, $scope.data_mm, $scope.data_mm_total);
                    db2d3(stages_feeds, rollouts_feeds, rollout_duration_feeds, $scope.data_feeds, $scope.data_feeds_total);
                });
            });
        };
        $scope.$on('cfgChange', function (event, data) {
            $scope.buildCharts();
        });
        $scope.buildCharts();
}]);

//convert the stages and rollouts data structure to $scope.data_ data structure like this:
//{
//  data:[
//         {"key" : stage1,
//          "values" : [[changeNumber1, stage1duration], [changeNumber2, stage1duration]..]
//         },
//         {"key" : stage2,
//          "values" : [[changeNumber1, stage2duration], [changeNumber2, stage2duration]..]
//         },
//       ]
//}
function db2d3(curstages, currollouts, rolloutdurations, scopedata, scopedatatotal) {
    var stages = []; //[stage1, stage2...]
    for (var key in curstages) {
        stages.push(key);
    }
    stages.sort();

    var rollouts = [];
    for (var key in currollouts) {
        rollouts.push(key);
    }
    rollouts.sort();

    var seenRollouts = {};
    for (var s = 0; s < stages.length; ++s) {
        var stage = stages[s];
        var series = {};
        var seriesTotal = {};
        series["key"] = stages[s];
        series["values"] = [];
        seriesTotal["key"] = ["total"];
        seriesTotal["values"] = [];
        for (var r = 0; r < rollouts.length; ++r) {
            var startTime = rollouts[r];
            var changeNumber = currollouts[startTime];
            var rolloutDate = new Date(startTime);
            var label = (rolloutDate.getMonth() + 1).toString() + '/' + rolloutDate.getDate().toString() + '-' + changeNumber;

            var duration = 0;
            if (changeNumber in curstages[stage] && curstages[stage][changeNumber] != null) {
                duration = curstages[stage][changeNumber];
            }
            series["values"].push([label, duration]);

            if (!(changeNumber in seenRollouts)) {
                var durationTotal = rolloutdurations[changeNumber];
                seriesTotal["values"].push([label, durationTotal]);
                seenRollouts[changeNumber] = 0;
            }
        }
        scopedata.push(series);
        scopedatatotal.push(seriesTotal);
    }
};
