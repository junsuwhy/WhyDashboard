$arrGraphType = [1];
$arrSvg = [];

//一些style
$css = {
    dark: "dark",
    light: "light"
};

//設定一些變數
//寬
width = 700;
//高
height = 480;
//留白
padding = 50;
//每條長條旁邊的留白寬度跟長條寬度的比例
filler = "2:1";
arrFil = [];
arrFil[0] = parseInt(filler[0]);
arrFil[1] = parseInt(filler[2]);
//單一一個文字的像素
em = 16;
//後來沒什麼用到的變數
xlength = width - 2 * padding;
ylength = height - 2 * padding;

//把每個圖表變更成物件類型
whysto = function (svgname, csvfile) {

    this.getDurat = function () {
        return $dataType.durat;
    }

    //圖表設定
    var $dataType = {
        durat: 'h',
        type1: 'cmeo',
        timeInterval: 1,
        page: Drupal.settings.neticrm_stat.page
    };


    //不同圖報單純用到的變數
    var $D3currArray = null;
    var $svg = null;
    var $g1 = null;
    var $jsonData = null;
    var $currArray = null;

    var $x;
    var $y;
    var $height;

    //文字出現1000轉成K
    var k = function (num) {
        if (num < 1000) {
            return num
        } else {
            l = Math.floor(num / 1000);
            var l000 = l * 1000;
            r = Math.floor((num - l000) / 100);
            var lr00 = l * 1000 + r * 100;
            if ((num - lr00) > 50) {
                r++;
                if (r > 10) {
                    r = 0;
                    l++;
                }
            }
            return l + "." + r;
        }
    }

    //把數字轉成星期
    var weekday = function (i) {
        var day = "星期";
        switch (i) {
        case 0:
            day += "一";
            break;
        case 1:
            day += "二";
            break;
        case 2:
            day += "三";
            break;
        case 3:
            day += "四";
            break;
        case 4:
            day += "五";
            break;
        case 5:
            day += "六";
            break;
        case 6:
            day += "日";
            break;
        }
        return day;
    }

    //長條旁邊的留白跟長條加總的寬度
    var unitWidth = function (arr) {
        return xlength / arr.length
    };
    //長條的寬度, 用上面那個數字乘上比例filler
    var rectWidth = function (arr) {
        return arrFil[1] * unitWidth(arr) / (arrFil[0] + arrFil[1])
    };
    //長條之間的留白寬度
    var offsetWidth = function (arr) {
        return arrFil[0] * unitWidth(arr) / (arrFil[0] + arrFil[1])
    };

    //取得最大值, 後來發現d3.max好像就可以用了
    var arrMax = function () {
        max = $currArray[0]
        for (var i = 0; i < $currArray.length; i++) {
            if ($currArray[i] > max) max = $currArray[i];
        };
        return max;
    }

    //定義長條樣式
    var rectStyle = function (worh, i) {
        switch (worh) {
            //以星期計，週六週日亮色
        case "w":
            if (i < 5) {
                return $css.dark;
            } else {
                return $css.light;
            }
            break;
            //以小時計，6~18點為白天，亮色
        case "h":
            if (i > 6 && i < 18) {
                return $css.light;
            } else {
                return $css.dark;
            }
            break;
        }
    }


    //取得cmet/cmeo的比例
    //horw代入"h"或"w"可取得hour 或weekday的值
    var arrCmetOverCmeo = function (horw) {
        arrCmet = arrFromObj($jsonData["cmet." + horw]);
        arrCmeo = arrFromObj($jsonData["cmeo." + horw]);
        arr = new Array();
        for (var i = 0; i < arrCmet.length; i++) {
            arr.push(arrCmet[i] / arrCmeo[i]);
        };

        return arr;
    }

    var arrFromCSA = function (csaKey, horw) {
        console.log($jsonData, horw);
        arrCSA = arrFromObj($jsonData['ccb.' + horw]);
        arrReturn = [];
        for (var i = 0; i < arrCSA.length; i++) {
            arrReturn.push(arrCSA[i][csaKey]);
        };
        return arrReturn;

    }

    //換區間
    this.showTimeRange = function (intVal) {
        $dataType.timeInterval = intVal;
        arrYPosition = [];
        for (var i = 0; i < $currArray.length; i++) {
            if (i % intVal == 0) {
                lastTotal = 0;
            }
            arrYPosition[i] = lastTotal + $currArray[i];
            lastTotal = arrYPosition[i];

        };


        $svg.selectAll('rect').transition().duration(1500).delay(function (d, i) {
            return i * 30
        })
            .attr('y', function (d, i) {
                return $y(arrYPosition[i] / intVal);
            })
            .attr('height', function (d, i) {
                return $height(d / intVal)
            })
            .attr('x', function (d, i) {
                return $x(i - i % intVal) - rectWidth($currArray);
            })
            .attr('width', function (d, i) {
                return rectWidth($currArray) * intVal;
            })

        ;

        $svg.selectAll('.value').transition().duration(1500)
            .style('fill-opacity', 0).remove();
        $svg.selectAll('.tag').transition().duration(1500)
            .style('fill-opacity', 0).remove();
        if (intVal == 1) {
            //加入tag的字
            $D3currArray.append('text').text(function (d, i) {
                if ($dataType.durat == "w") {
                    return weekday(i);
                } else {
                    return i;
                }
            })
                .attr('x', function (d, i) {
                    return $x(i) - (1.5) * rectWidth($currArray);
                })
                .attr('y', function (d, i) {
                    return height - padding + em;
                })
                .attr('class', 'tag')
                .style('fill-opacity', 0)
                .transition().duration(1500)
                .style('fill-opacity', 1);

            //加入value的字
            $D3currArray.append('text')

            .attr('transform', function (d, i) {
                str = "";
                str += 'translate(';
                str += ($x(i));
                str += ',';
                str += ($y(d)) - em;
                str += ')';
                //str += 'rotate(-75)';
                return str;
            })
                .attr('class', 'value')
                .text(function (d, i) {
                    return k(Math.floor(d * 1000) / 1000);
                })
                .style('fill-opacity', 0)
                .transition().duration(1500)
                .style('fill-opacity', 1);


        } else {

            for (var i = 0; i < arrYPosition.length / intVal; i++) {
                $svg.append('text').attr('class', 'tag')
                    .text((i * intVal + 1) + '到' + (i + 1) * intVal + "點")
                    .attr('x', $x(i * intVal) - (3) * rectWidth($currArray))
                    .attr('y', height - padding + em)
                    .style('fill-opacity', 0)
                    .transition().duration(1500)
                    .style('fill-opacity', 1);

                $svg.append('text').attr('class', 'value')
                    .attr('transform', function (d, i2) {
                        str = "";
                        str += 'translate(';
                        str += ($x(i * intVal));
                        str += ',';
                        str += $y(arrYPosition[((i + 1) * intVal) - 1] / intVal) - em;
                        str += ')';
                        //str += 'rotate(-75)';
                        return str;
                    })
                    .attr('class', 'value')
                    .text(k(Math.floor(arrYPosition[((i + 1) * intVal) - 1] * 1000) / 1000))
                    .style('fill-opacity', 0)
                    .transition().duration(1500)
                    .style('fill-opacity', 1);
            };
        };


    };
    var showTimeRange = this.showTimeRange;

    //排序
    this.showsortit = function (bVal) {
        console.log(bVal);

        if (bVal) {
            //要照大小排序
            sortArray = $currArray.concat().sort(function (a, b) {
                return b - a
            });
            var orderArray = [];
            for (var i = 0; i < sortArray.length; i++) {
                orderArray[i] = sortArray.indexOf($currArray[i]);
            };
        } else {
            //只照x座標order 來排序(預設)
            orderArray = d3.range($currArray.length);
        }

        $svg.selectAll('rect').transition().duration(1500).delay(function (d, i) {
            return i * 30
        })
            .attr('x', function (d, i) {
                return $x(orderArray[i]) - rectWidth($currArray);
            });

        $svg.selectAll('.tag').transition()
            .duration(1500).delay(function (d, i) {
                return i * 30
            })
            .attr('x', function (d, i) {
                return $x(orderArray[i]) - (1.5) * rectWidth($currArray);
            });

        $svg.selectAll('.value').transition()
            .duration(1500).delay(function (d, i) {
                return i * 30
            })
            .attr('transform', function (d, i) {
                str = "";
                str += 'translate(';
                str += ($x(orderArray[i]));
                str += ',';
                str += ($y(d)) - em;
                str += ')';
                //str += 'rotate(-75)';
                return str;
            });



    };

    //決定當前套用的svg
    var selectSvgObjects = function (svg_id) {
        //如果div#svg_id裡面沒有svg
        if (d3.select('#' + svg_id + ' svg')[0][0] = null) return false;

        $svg = d3.select('#' + svg_id + ' svg');
        $g1 = $svg.select("g").selectAll('#group1');


    };

    //建立新的svg繪圖物件, 用在初始時.換小時/星期的情況
    this.addSvgObjects = function (svg_id) {

        //初始化 清空#svg-container, 設定$svg,$g1
        $("#" + svg_id).empty();
        $("#" + svg_id).append('<svg>');
        $svg = d3.select('#' + svg_id + ' svg');
        $svg.attr('width', width).attr('height', height);
        $g1 = $svg.append("g").attr('id', 'group1').selectAll('#group1');


    };

    //
    this.visualize_start = function (importdata) {
        $importdata = importdata;

        $dataType.timeInterval = 1;
        $dataType.type1 = dataType.split('.')[0];
        $dataType.durat = dataType.split('.')[1];



        console.log($dataType);

        //指定要代入的資料矩陣是什麼
        if ($dataType.type1 == 'cmeto') {
            //cmeto是cmet/cmeo的值
            $currArray = arrCmetOverCmeo(dataType.durat);
        } else if ($dataType.type1.substr(0, 3) == 'ccb') {
            //此時$dataType.type1整個字串為ccb->count 這種型式, 要再拆開取出->後面的字串
            csaKey = $dataType.type1.split('->')[1];
            $currArray = arrFromCSA(csaKey, dataType.durat);
        } else {
            //剩下cmeo, cmet
            $currArray = arrFromObj($jsonData[dataType]);
        }

        //給定D3currArray  是d3.data.enter的物件
        $D3currArray = $g1.data($currArray).enter();

        //設定$x,$y,$height三個 domain 函數
        $x = d3.scale.ordinal()
            .domain(d3.range($currArray.length))
            .rangePoints([padding, width - padding]);
        $y = d3.scale.linear()
            .domain([0, arrMax()])
            .range([height - padding, 2 * padding]);
        $height = d3.scale.linear()
            .domain([0, arrMax()])
            .range([0, height - 3 * padding]);


        //畫長條
        //畫長條
        $D3currArray.append('rect')
            .attr('x', function (d, i) {
                return $x(i) - rectWidth($currArray);
            })
            .attr('y', function (d, i) {
                return height - padding;
            })
            .attr('width', function (d, i) {
                return rectWidth($currArray)
            })
            .attr("height", 0);

        $svg.selectAll('rect')
            .property('__data__', function (d, i) {
                return $currArray[i]
            })
            .attr('class', function (d, i) {
                return rectStyle($dataType.durat, i);
            });
        //.attr('fill', 'blue');



        //加入tag的字
        $D3currArray.append('text').text(function (d, i) {
            if ($dataType.durat == "w") {
                return weekday(i);
            } else {
                return i;
            }
        })
            .attr('x', function (d, i) {
                return $x(i) - (1.5) * rectWidth($currArray);
            })
            .attr('y', function (d, i) {
                return height - padding + em;
            })
            .attr('class', 'tag')
            .style('fill-opacity', 1);

        //加入value的字
        $svg.selectAll('.value')
            .property('__data__', function (d, i) {
                return $currArray[i]
            })

        showTimeRange($dataType.timeInterval);



    };
    //函式:把object轉成array
    arrFromObj = function (myObj) {
        arr = []
        $.each(myObj, function (i, n) {
            arr.push(n);
        });
        return arr;
    };

    svg.addSvgObjects(svgname);

};

d3.csv(csvfile, function (error, csvdata) {
    //console.log(jsonData);
    if (error) return console.warn(error);

    for (var i = 0; i < $arrGraphType.length; i++) {

        var svg = new whysto(svgname, csvdata);
        svg.visualize_start(csvdata);
        $arrSvg[i] = svg;
    };

});