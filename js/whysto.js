//把每個圖表變更成物件類型
whysto = function (svgname, csvdata, attribute) {

    this.attribute = attribute;
    console.log(attribute);
    //

    //一些style
    this.$css = {
        dark: "dark",
        light: "light"
    };

    //設定一些變數
    //寬
    this.width = csvdata.length * 90;
    //高
    this.height = 270;
    //留白
    this.padding = 50;
    //每條長條旁邊的留白寬度跟長條寬度的比例
    this.filler = "1:2";
    var arrFil = [];
    arrFil[0] = parseInt(this.filler[0]);
    arrFil[1] = parseInt(this.filler[2]);
    this.arrFil = arrFil;
    //單一一個文字的像素
    this.em = 16;

    this.tagname = attribute.tagname;
    this.svgname = svgname;

    //設定此Object要用的變數
    //寬
    var width = this.width;
    //高
    var height = this.height;
    //留白
    var padding = this.padding;
    //每條長條旁邊的留白寬度跟長條寬度的比例
    var filler = this.filler;
    var arrFil = this.arrFil;
    //單一一個文字的像素
    var em = this.em;

    var $data = csvdata;

    var tagname = {
        tag: "date",
        value: "steps"
    };

    var attribute = this.attribute;

    var svgname = this.svgname;

    tagname = this.tagname;
    myself = this;



    initial = function () {

    };





    //不同圖表單純用到的變數
    var $D3currArray = null;
    var $svg = null;
    var $g1 = null;
    var $jsonData = null;
    var $currArray = null;

    var $x;
    var $y;
    var $height;
    var $color;

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

    //長條旁邊的留白跟長條加總的寬度
    var unitWidth = function (arr) {
        return (width - 2 * padding) / arr.length
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
    arrMax = function () {
        max = Number($data[0][tagname.value]);
        for (var i = 0; i < $data.length; i++) {
            if (Number($data[i][tagname.value]) > max) max = Number($data[i][tagname.value]);
        };
        return max;
    };

    //換區間
    this.showTimeRange = function (intVal) {
        arrYPosition = [];
        for (var i = 0; i < $data.length; i++) {
            if (i % intVal == 0) {
                lastTotal = 0;
            }
            arrYPosition[i] = lastTotal + Number($data[i][tagname.value]);
            lastTotal = arrYPosition[i];

        };
        //console.log(arrYPosition);


        $svg.selectAll('rect').transition().duration(1000).delay(function (d, i) {
            return i * 30
        })
            .attr('y', function (d, i) {
                return $y(arrYPosition[i] / intVal);
            })
            .attr('height', function (d, i) {
                return $height(d[tagname.value] / intVal)
            })
            .attr('x', function (d, i) {
                return $x(i - i % intVal) - rectWidth($data);
            })
            .attr('width', function (d, i) {
                return rectWidth($data) * intVal;
            })
            .style('fill', function (d, i) {
                return $color(d[tagname.value]);
            });

        $svg.selectAll('.value').transition().duration(1000)
            .style('fill-opacity', 0).remove();
        $svg.selectAll('.tag').transition().duration(1000)
            .style('fill-opacity', 0).remove();
        //加入tag的字
        $D3currArray.append('text').text(function (d, i) {
            return d[tagname.tag];
        })
            .attr('x', function (d, i) {
                return $x(i) - (0.5) * rectWidth($data);
            })
            .attr('y', function (d, i) {
                return height - padding + em;
            })
            .attr('class', function (d, i) {
                return "tag t" + d[tagname.tag];
            })

        .attr('text-anchor', 'middle')
            .style('fill-opacity', 0)
            .transition().duration(1500)
            .style('fill-opacity', 1);

        //加入value的字
        $D3currArray.append('text')

        .attr('transform', function (d, i) {
            str = "";
            str += 'translate(';
            str += ($x(i) - (rectWidth($data) / 2));
            str += ',';
            str += ($y(d[tagname.value])) - 2 * em;
            str += ')';
            //str += 'rotate(-75)';
            return str;
        })
            .attr('class', 'value')
            .attr('text-anchor', 'middle')
            .text(function (d, i) {
                return Math.floor(d[tagname.value] * 1000) / 1000;
                //return d[tagname.value];
            })
            .style('fill-opacity', 0)
            .attr('class', function (d, i) {
                return "tag t" + d[tagname.tag];
            })
            .transition().duration(1500)
            .style('fill-opacity', 1);




    };
    var showTimeRange = this.showTimeRange;



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
    this.visualize_start = function (data) {
        $data = data;


        //給定D3currArray  是d3.data.enter的物件
        $D3currArray = $g1.data($data).enter();

        //設定$x,$y,$height三個 domain 函數
        $x = d3.scale.ordinal()
            .domain(d3.range($data.length))
            .rangePoints([padding, width - padding]);
        $y = d3.scale.linear()
            .domain([0, arrMax()])
            .range([height - padding, 2 * padding]);
        $height = d3.scale.linear()
            .domain([0, arrMax()])
            .range([0, height - 3 * padding]);
        $color = d3.scale.linear();
        if (typeof (myself.attribute.colordomain) == "undefined") {
            $color = $color.domain([0, arrMax()])
        } else {
            $color = $color.domain([myself.attribute.colordomain[0], myself.attribute.colordomain[1]]);
        }
        $color = $color.range([myself.attribute.colorrange[0], myself.attribute.colorrange[1]]);


        //畫長條
        //畫長條
        $D3currArray.append('rect')
            .attr('x', function (d, i) {
                return $x(i) - rectWidth($data);
            })
            .attr('y', function (d, i) {
                return height - padding;
            })
            .attr('width', function (d, i) {
                return rectWidth($data)
            })
            .attr("height", 0)
            .attr('class', function (d, i) {
                //console.log(d);
                return "t" + d[tagname.tag];
            })
            .style('fill', function (d, i) {
                return $color(d[tagname.value]);
            })
            .attr('data-date', function (d, i) {
                return d[tagname.tag]
            });

        /*
        $svg.selectAll('rect')
            .property('__data__', function (d, i) {
                return $data[i];
            })
            .attr('class', function (d, i) {
                return 'ohya';
            });*/
        //.attr('fill', 'blue');



        //加入tag的字
        $D3currArray.append('text').text(function (d, i) {
            return i;
        })
            .attr('x', function (d, i) {
                return $x(i) - (1.5) * rectWidth($data);
            })
            .attr('y', function (d, i) {
                return height - padding + em;
            })
            .attr('class', function (d, i) {
                return "tag t" + d[tagname.tag];
            })
            .style('fill-opacity', 1);

        //給week的class name
        var arr = d3.selectAll('#' + this.svgname + ' rect');
        myself.onclick = function () {
            var thisrect = d3.select(this);
            var thisweek = thisrect.attr('data-weekno');
            var x = d3.selectAll('#' + svgname + ' rect.w' + thisweek).attr('x');
            $('#' + svgname).parent().scrollLeft(x);

        };
        arr.each(function (i) {
            var today = d3.select(this).attr('data-date');
            var date = new Date(today);
            var week = (date.getWeekday() == 0 ?
                (date.getISOWeek() + 1) % 52 : date.getISOWeek());
            d3.select(this)
                .classed('w' + week, true)
                .attr('data-weekno', week)
                .on('click', myself.onclick);

        });
        //加入value的字
        /*
        $svg.selectAll('.value')
            .property('__data__', function (d, i) {
                return $data[i][tagname.value]
            })*/

        //給動作
        d3.selectAll('#' + this.svgname + ' rect').on('mouseover', function () {
            today = d3.select(this).attr('data-date');
            d3.selectAll('.t' + today).classed('mouseon', true);

        }).on('mouseout', function () {
            today = d3.select(this).attr('data-date');
            d3.selectAll('.t' + today).classed('mouseon', false);

        });


        showTimeRange(1);



    };
    //函式:把object轉成array
    arrFromObj = function (myObj) {
        arr = []
        $.each(myObj, function (i, n) {
            arr.push(n);
        });
        return arr;
    };

    this.addSvgObjects(svgname);
    this.visualize_start(csvdata);
    return this;

};

/*
d3.csv(csvfile, function (error, csvdata) {
    //console.log(jsonData);
    if (error) return console.warn(error);

    for (var i = 0; i < $arrGraphType.length; i++) {

        var svg = new whysto(svgname, csvdata);
        svg.visualize_start(csvdata);
        $arrSvg[i] = svg;
    };

});*/