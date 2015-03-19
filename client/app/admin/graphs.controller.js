'use strict';

angular.module('its110App')
  .controller('GenericChartCtrl', function ($scope) {
    $scope.chartObject = {};

    $scope.topicMap = {
    	'54dbb8cc27541070e9415a41': 'Loops',
    	'54db0c6a27541070e9415a3e': 'Methods',
    	'54dce1d604e78631e67f72e9': 'If-Statements',
    	'54dce1fd04e78631e67f72eb': 'Everything Combined: Writing Code',
    	'54dce1f404e78631e67f72ea': 'Everything Combined: Tracing'
    };
    $scope.onions = [
        {v: "Code Reading"},
        {v: 3},
        {v: 22},
        {v: 32},
        {v: 5},
        {v: 14}
    ];

    // $scope.chartObject.data = {"cols": [
    //     {id: "t", label: "Topic", type: "string"},
    //     {id: "c", label: "Number of Compiles", type: "number"},
    //     {id: "r", label: "Number of Runs", type: "number" },
    //     {id: "h", label: "Number of Hints", type: "number" },
    //     {id: "ta", label: "Total Number of Attempts", type: "number" },
    //     {id: "tca", label: "Total Number of Correct Attempts", type: "number" }
    // ], "rows": [
    //     {c: [
    //         {v: "Loops"},
    //         {v: 13},
    //         {v: 42},
    //         {v: 3},
    //         {v: 45},
    //         {v: 4}
    //     ]},
    //     {c: $scope.onions},
    //     {c: [
    //         {v: "If Statements"},
    //         {v: 33},
    //         {v: 2},
    //         {v: 3},
    //         {v: 45},
    //         {v: 4}
    //     ]},
    //     {c: [
    //         {v: "Code Writing"},
    //         {v: 13},
    //         {v: 32},
    //         {v: 32},
    //         {v: 5},
    //         {v: 4}
    //     ]},
    //     {c: [
    //         {v: "Print Statements"},
    //         {v: 13},
    //         {v: 42},
    //         {v: 3},
    //         {v: 5},
    //         {v: 4}
    //     ]}
    // ]};

    // var data = google.visualization.arrayToDataTable([
    //    ['Employee Name', 'Salary'],
    //    ['Mike', {v:22500, f:'22,500'}], // Format as "22,500".
    //    ['Bob', 35000],
    //    ['Alice', 44000],
    //    ['Frank', 27000],
    //    ['Floyd', 92000],
    //    ['Fritz', 18500]
    //   ],
    //   false); 

    // $routeParams.chartType == BarChart or PieChart or ColumnChart...
    //$scope.chartObject.type = $routeParams.chartType;
    $scope.chartObject.type = 'ColumnChart';
    $scope.chartObject.options = {
        'title': 'Total Times Spent per Topic',
        'isStacked': 'false'
    }

    $scope.topicTimeSumsGraphs = [
    {
        "cols": [
            {
                "id": "t",
                "label": "Topic",
                "type": "string"
            },
            {
                "id": "qa",
                "label": "Total time spent on topic",
                "type": "number"
            }
        ],
        "rows": [
            {
                "c": [
                    {
                        "v": "Loops"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Methods"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "If-Statements"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Writing Code"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Tracing"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Arrays"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Print statements"
                    },
                    {
                        "v": 0
                    }
                ]
            }
        ]
    },
    {
        "cols": [
            {
                "id": "t",
                "label": "Topic",
                "type": "string"
            },
            {
                "id": "qa",
                "label": "Total time spent on topic",
                "type": "number"
            }
        ],
        "rows": [
            {
                "c": [
                    {
                        "v": "Loops"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Methods"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "If-Statements"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Writing Code"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Tracing"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Arrays"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Print statements"
                    },
                    {
                        "v": 0
                    }
                ]
            }
        ]
    },
    {
        "cols": [
            {
                "id": "t",
                "label": "Topic",
                "type": "string"
            },
            {
                "id": "qa",
                "label": "Total time spent on topic",
                "type": "number"
            }
        ],
        "rows": [
            {
                "c": [
                    {
                        "v": "Loops"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Methods"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "If-Statements"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Writing Code"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Tracing"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Arrays"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Print statements"
                    },
                    {
                        "v": 0
                    }
                ]
            }
        ]
    },
    {
        "cols": [
            {
                "id": "t",
                "label": "Topic",
                "type": "string"
            },
            {
                "id": "qa",
                "label": "Total time spent on topic",
                "type": "number"
            }
        ],
        "rows": [
            {
                "c": [
                    {
                        "v": "Loops"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Methods"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "If-Statements"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Writing Code"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Tracing"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Arrays"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Print statements"
                    },
                    {
                        "v": 0
                    }
                ]
            }
        ]
    },
    {
        "cols": [
            {
                "id": "t",
                "label": "Topic",
                "type": "string"
            },
            {
                "id": "qa",
                "label": "Total time spent on topic",
                "type": "number"
            }
        ],
        "rows": [
            {
                "c": [
                    {
                        "v": "Loops"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Methods"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "If-Statements"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Writing Code"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Tracing"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Arrays"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Print statements"
                    },
                    {
                        "v": 0
                    }
                ]
            }
        ]
    },
    {
        "cols": [
            {
                "id": "t",
                "label": "Topic",
                "type": "string"
            },
            {
                "id": "qa",
                "label": "Total time spent on topic",
                "type": "number"
            }
        ],
        "rows": [
            {
                "c": [
                    {
                        "v": "Loops"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Methods"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "If-Statements"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Writing Code"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Tracing"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Arrays"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Print statements"
                    },
                    {
                        "v": 0
                    }
                ]
            }
        ]
    },
    {
        "cols": [
            {
                "id": "t",
                "label": "Topic",
                "type": "string"
            },
            {
                "id": "qa",
                "label": "Total time spent on topic",
                "type": "number"
            }
        ],
        "rows": [
            {
                "c": [
                    {
                        "v": "Loops"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Methods"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "If-Statements"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Writing Code"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Tracing"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Arrays"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Print statements"
                    },
                    {
                        "v": 0
                    }
                ]
            }
        ]
    },
    {
        "cols": [
            {
                "id": "t",
                "label": "Topic",
                "type": "string"
            },
            {
                "id": "qa",
                "label": "Total time spent on topic",
                "type": "number"
            }
        ],
        "rows": [
            {
                "c": [
                    {
                        "v": "Loops"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Methods"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "If-Statements"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Writing Code"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Tracing"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Arrays"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Print statements"
                    },
                    {
                        "v": 0
                    }
                ]
            }
        ]
    },
    {
        "cols": [
            {
                "id": "t",
                "label": "Topic",
                "type": "string"
            },
            {
                "id": "qa",
                "label": "Total time spent on topic",
                "type": "number"
            }
        ],
        "rows": [
            {
                "c": [
                    {
                        "v": "Loops"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Methods"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "If-Statements"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Writing Code"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Tracing"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Arrays"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Print statements"
                    },
                    {
                        "v": 0
                    }
                ]
            }
        ]
    },
    {
        "cols": [
            {
                "id": "t",
                "label": "Topic",
                "type": "string"
            },
            {
                "id": "qa",
                "label": "Total time spent on topic",
                "type": "number"
            }
        ],
        "rows": [
            {
                "c": [
                    {
                        "v": "Loops"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Methods"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "If-Statements"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Writing Code"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Tracing"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Arrays"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Print statements"
                    },
                    {
                        "v": 0
                    }
                ]
            }
        ]
    },
    {
        "cols": [
            {
                "id": "t",
                "label": "Topic",
                "type": "string"
            },
            {
                "id": "qa",
                "label": "Total time spent on topic",
                "type": "number"
            }
        ],
        "rows": [
            {
                "c": [
                    {
                        "v": "Loops"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Methods"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "If-Statements"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Writing Code"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Tracing"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Arrays"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Print statements"
                    },
                    {
                        "v": 0
                    }
                ]
            }
        ]
    },
    {
        "cols": [
            {
                "id": "t",
                "label": "Topic",
                "type": "string"
            },
            {
                "id": "qa",
                "label": "Total time spent on topic",
                "type": "number"
            }
        ],
        "rows": [
            {
                "c": [
                    {
                        "v": "Loops"
                    },
                    {
                        "v": 270331
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Methods"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "If-Statements"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Writing Code"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Tracing"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Arrays"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Print statements"
                    },
                    {
                        "v": 14118
                    }
                ]
            }
        ]
    },
    {
        "cols": [
            {
                "id": "t",
                "label": "Topic",
                "type": "string"
            },
            {
                "id": "qa",
                "label": "Total time spent on topic",
                "type": "number"
            }
        ],
        "rows": [
            {
                "c": [
                    {
                        "v": "Loops"
                    },
                    {
                        "v": 339920
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Methods"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "If-Statements"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Writing Code"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Tracing"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Arrays"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Print statements"
                    },
                    {
                        "v": 69415
                    }
                ]
            }
        ]
    },
    {
        "cols": [
            {
                "id": "t",
                "label": "Topic",
                "type": "string"
            },
            {
                "id": "qa",
                "label": "Total time spent on topic",
                "type": "number"
            }
        ],
        "rows": [
            {
                "c": [
                    {
                        "v": "Loops"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Methods"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "If-Statements"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Writing Code"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Tracing"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Arrays"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Print statements"
                    },
                    {
                        "v": 0
                    }
                ]
            }
        ]
    },
    {
        "cols": [
            {
                "id": "t",
                "label": "Topic",
                "type": "string"
            },
            {
                "id": "qa",
                "label": "Total time spent on topic",
                "type": "number"
            }
        ],
        "rows": [
            {
                "c": [
                    {
                        "v": "Loops"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Methods"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "If-Statements"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Writing Code"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Tracing"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Arrays"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Print statements"
                    },
                    {
                        "v": 0
                    }
                ]
            }
        ]
    },
    {
        "cols": [
            {
                "id": "t",
                "label": "Topic",
                "type": "string"
            },
            {
                "id": "qa",
                "label": "Total time spent on topic",
                "type": "number"
            }
        ],
        "rows": [
            {
                "c": [
                    {
                        "v": "Loops"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Methods"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "If-Statements"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Writing Code"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Tracing"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Arrays"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Print statements"
                    },
                    {
                        "v": 0
                    }
                ]
            }
        ]
    },
    {
        "cols": [
            {
                "id": "t",
                "label": "Topic",
                "type": "string"
            },
            {
                "id": "qa",
                "label": "Total time spent on topic",
                "type": "number"
            }
        ],
        "rows": [
            {
                "c": [
                    {
                        "v": "Loops"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Methods"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "If-Statements"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Writing Code"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Tracing"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Arrays"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Print statements"
                    },
                    {
                        "v": 0
                    }
                ]
            }
        ]
    },
    {
        "cols": [
            {
                "id": "t",
                "label": "Topic",
                "type": "string"
            },
            {
                "id": "qa",
                "label": "Total time spent on topic",
                "type": "number"
            }
        ],
        "rows": [
            {
                "c": [
                    {
                        "v": "Loops"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Methods"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "If-Statements"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Writing Code"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Tracing"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Arrays"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Print statements"
                    },
                    {
                        "v": 0
                    }
                ]
            }
        ]
    },
    {
        "cols": [
            {
                "id": "t",
                "label": "Topic",
                "type": "string"
            },
            {
                "id": "qa",
                "label": "Total time spent on topic",
                "type": "number"
            }
        ],
        "rows": [
            {
                "c": [
                    {
                        "v": "Loops"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Methods"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "If-Statements"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Writing Code"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Tracing"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Arrays"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Print statements"
                    },
                    {
                        "v": 0
                    }
                ]
            }
        ]
    },
    {
        "cols": [
            {
                "id": "t",
                "label": "Topic",
                "type": "string"
            },
            {
                "id": "qa",
                "label": "Total time spent on topic",
                "type": "number"
            }
        ],
        "rows": [
            {
                "c": [
                    {
                        "v": "Loops"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Methods"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "If-Statements"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Writing Code"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Tracing"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Arrays"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Print statements"
                    },
                    {
                        "v": 0
                    }
                ]
            }
        ]
    },
    {
        "cols": [
            {
                "id": "t",
                "label": "Topic",
                "type": "string"
            },
            {
                "id": "qa",
                "label": "Total time spent on topic",
                "type": "number"
            }
        ],
        "rows": [
            {
                "c": [
                    {
                        "v": "Loops"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Methods"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "If-Statements"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Writing Code"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Tracing"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Arrays"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Print statements"
                    },
                    {
                        "v": 0
                    }
                ]
            }
        ]
    },
    {
        "cols": [
            {
                "id": "t",
                "label": "Topic",
                "type": "string"
            },
            {
                "id": "qa",
                "label": "Total time spent on topic",
                "type": "number"
            }
        ],
        "rows": [
            {
                "c": [
                    {
                        "v": "Loops"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Methods"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "If-Statements"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Writing Code"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Tracing"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Arrays"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Print statements"
                    },
                    {
                        "v": 0
                    }
                ]
            }
        ]
    },
    {
        "cols": [
            {
                "id": "t",
                "label": "Topic",
                "type": "string"
            },
            {
                "id": "qa",
                "label": "Total time spent on topic",
                "type": "number"
            }
        ],
        "rows": [
            {
                "c": [
                    {
                        "v": "Loops"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Methods"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "If-Statements"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Writing Code"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Tracing"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Arrays"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Print statements"
                    },
                    {
                        "v": 0
                    }
                ]
            }
        ]
    },
    {
        "cols": [
            {
                "id": "t",
                "label": "Topic",
                "type": "string"
            },
            {
                "id": "qa",
                "label": "Total time spent on topic",
                "type": "number"
            }
        ],
        "rows": [
            {
                "c": [
                    {
                        "v": "Loops"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Methods"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "If-Statements"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Writing Code"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Tracing"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Arrays"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Print statements"
                    },
                    {
                        "v": 0
                    }
                ]
            }
        ]
    },
    {
        "cols": [
            {
                "id": "t",
                "label": "Topic",
                "type": "string"
            },
            {
                "id": "qa",
                "label": "Total time spent on topic",
                "type": "number"
            }
        ],
        "rows": [
            {
                "c": [
                    {
                        "v": "Loops"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Methods"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "If-Statements"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Writing Code"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Tracing"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Arrays"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Print statements"
                    },
                    {
                        "v": 0
                    }
                ]
            }
        ]
    },
    {
        "cols": [
            {
                "id": "t",
                "label": "Topic",
                "type": "string"
            },
            {
                "id": "qa",
                "label": "Total time spent on topic",
                "type": "number"
            }
        ],
        "rows": [
            {
                "c": [
                    {
                        "v": "Loops"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Methods"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "If-Statements"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Writing Code"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Tracing"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Arrays"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Print statements"
                    },
                    {
                        "v": 0
                    }
                ]
            }
        ]
    },
    {
        "cols": [
            {
                "id": "t",
                "label": "Topic",
                "type": "string"
            },
            {
                "id": "qa",
                "label": "Total time spent on topic",
                "type": "number"
            }
        ],
        "rows": [
            {
                "c": [
                    {
                        "v": "Loops"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Methods"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "If-Statements"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Writing Code"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Tracing"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Arrays"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Print statements"
                    },
                    {
                        "v": 0
                    }
                ]
            }
        ]
    },
    {
        "cols": [
            {
                "id": "t",
                "label": "Topic",
                "type": "string"
            },
            {
                "id": "qa",
                "label": "Total time spent on topic",
                "type": "number"
            }
        ],
        "rows": [
            {
                "c": [
                    {
                        "v": "Loops"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Methods"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "If-Statements"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Writing Code"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Tracing"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Arrays"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Print statements"
                    },
                    {
                        "v": 0
                    }
                ]
            }
        ]
    },
    {
        "cols": [
            {
                "id": "t",
                "label": "Topic",
                "type": "string"
            },
            {
                "id": "qa",
                "label": "Total time spent on topic",
                "type": "number"
            }
        ],
        "rows": [
            {
                "c": [
                    {
                        "v": "Loops"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Methods"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "If-Statements"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Writing Code"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Tracing"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Arrays"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Print statements"
                    },
                    {
                        "v": 0
                    }
                ]
            }
        ]
    },
    {
        "cols": [
            {
                "id": "t",
                "label": "Topic",
                "type": "string"
            },
            {
                "id": "qa",
                "label": "Total time spent on topic",
                "type": "number"
            }
        ],
        "rows": [
            {
                "c": [
                    {
                        "v": "Loops"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Methods"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "If-Statements"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Writing Code"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Tracing"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Arrays"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Print statements"
                    },
                    {
                        "v": 0
                    }
                ]
            }
        ]
    },
    {
        "cols": [
            {
                "id": "t",
                "label": "Topic",
                "type": "string"
            },
            {
                "id": "qa",
                "label": "Total time spent on topic",
                "type": "number"
            }
        ],
        "rows": [
            {
                "c": [
                    {
                        "v": "Loops"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Methods"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "If-Statements"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Writing Code"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Everything Combined: Tracing"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Arrays"
                    },
                    {
                        "v": 0
                    }
                ]
            },
            {
                "c": [
                    {
                        "v": "Print statements"
                    },
                    {
                        "v": 0
                    }
                ]
            }
        ]
    }
];

  });
  



