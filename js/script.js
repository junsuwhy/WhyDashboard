//jquery跑document ready要跑的函式
$(document).ready(function () {

    //設domain
    //x:scale
    /*
    x = d3.scale.linear().domain([0, 960]).range([0, 960]);

    //y:scale
    y = d3.scale.linear().domain([0, 720]).range([720, 0]);

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

    SVGWIDTH = 600;
    SVGHEIGHT = 480;

    data = 0;

    svg = d3.select('div#svg-container').append('svg')
        .attr('id', 'graph')
        .attr('width', SVGWIDTH)
        .attr('height', SVGHEIGHT);
        */

    inverse = function (arr) {
        var newarr = [];
        (arr.length - 1).times(function (i) {
            newarr.push(arr[arr.length - 1 - i])
        })
        return newarr;
    }

    arrWhysto = [];

    d3.csv("data/noom-walk-history.csv", function (d) {
            x = d;
            x.steps = Number(d[" steps"]);
            var day = new Date(d["date"]);
            x.date = day.getFullYear() + "-" + String(day.getMonth() + 1) + "-" + day.getDate();
            x.objDate = day;

            return x
        },
        function (e, d) {
            //讀完csv跑的函式
            console.log(inverse(d));
            data = d;

            //一些常用到的attributes:
            //text:x,y
            //rect:x,y,width,height,fill,stroke-fill
            //line:x1,y1,x2,y2,stroke,stroke-fill,stroke-dasharray
            //circle:cx,cy,r

            //groups = svg.selectAll('g').data(d).enter().append('g');
            //            $arrSvg = [];

            attribute = {
                tagname: {
                    tag: "date",
                    value: "steps"
                },
                colorrange: ['#abcdef', '#124311']
            };

            var tagname = {
                tag: "date",
                value: "steps"
            };

            var svg = new whysto('svg1', inverse(data), attribute);
            //$arrSvg[0] = svg;
            arrWhysto.push(svg);
            var lendar = new whylendar('svg1-1', inverse(data), attribute);
            lendar.ctlWhysto(arrWhysto);

            $('#svg1wrapper').delay(500).animate({
                scrollLeft: $('#svg1 svg').width() - $('#svg1').width()
            }, 2000);
        });
    d3.csv("data/sleepbot.csv", function (d) {
            var x = d;
            x.hours = Number(d[" Hours"]);
            //console.log("hours=", x.hours);
            x.sleeptime = d[" Sleep Time"];
            x.waketime = d[" Wake Time"];
            var day = new Date("20" + d["Date"]);
            x.date = day.getFullYear() + "-" + String(day.getMonth() + 1) + "-" + day.getDate();
            x.objDate = day;
            return x
        },
        function (e, d) {
            //讀完csv跑的函式
            //console.log(inverse(d));
            var arrDate = [];
            var data = [];
            (d.length).times(function (i) {
                if (arrDate.any(d[i].date)) {
                    day = data.last();
                    //console.log(day.hours);
                    //console.log(d[i].hours);
                    day.hours = (day.hours + d[i].hours).toFixed(3);
                    console.log(day);
                } else {
                    arrDate.push(d[i].date);
                    data.push(d[i]);
                }
            });

            //data = d;
            //console.log(data);


            //$arrSvg = [];
            attribute = {
                tagname: {
                    tag: "date",
                    value: "hours"
                },
                colorrange: ['#abcdef', '#05accc'],
                colordomain: [5, 6]
            };

            var tagname = {
                tag: "date",
                value: "hours"
            };

            var svg = new whysto('svg2', inverse(data), attribute);

            arrWhysto.push(svg);
            var lendar = new whylendar('svg2-1', inverse(data), attribute);
            lendar.ctlWhysto(arrWhysto);


            $('#svg2wrapper').delay(500).animate({
                scrollLeft: $('#svg2 svg').width() - $('#svg2').width()
            }, 2000);
        });
    d3.csv("data/money.csv", function (d) {
            x = d;
            //x.steps = Number(d[" steps"]);
            var day = new Date(d["日期"]);
            x.date = day.getFullYear() + "-" + String(day.getMonth() + 1) + "-" + day.getDate();
            x.money = Number(x["金額"]);
            x.objDate = day;
            return x
        },
        function (e, d) {
            //讀完csv跑的函式
            console.log(inverse(d));
            var arrDate = [];
            var data = [];

            (d.length).times(function (i) {
                if (d[i]["類型"] !== "收入" && d[i]["帳戶"].indexOf("->") == -1 && d[i].money < 1000) {
                    if (arrDate.any(d[i].date)) {
                        day = data.findAll({
                            date: d[i].date
                        })[0];
                        //console.log(day.hours);
                        //console.log(d[i].hours);
                        day.money = Number((day.money + d[i].money).toFixed(3));
                        console.log(day);
                    } else {
                        console.log(d[i]);
                        arrDate.push(d[i].date);
                        data.push(d[i]);
                    }
                }
            });
            //data = d;
            //console.log(data);


            //$arrSvg = [];
            attribute = {
                tagname: {
                    tag: "date",
                    value: "money"
                },
                colorrange: ['#7bfdcf', '#ed3327'] //,
                //colordomain: [5, 6]
            };

            var tagname = {
                tag: "date",
                value: "money"
            };

            var svg = new whysto('svg3', data, attribute);

            arrWhysto.push(svg);
            var lendar = new whylendar('svg3-1', data, attribute);
            lendar.ctlWhysto(arrWhysto);


            $('#svg3wrapper').delay(500).animate({
                scrollLeft: $('#svg3 svg').width() - $('#svg3').width()
            }, 2000);
        });
});