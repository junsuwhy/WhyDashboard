whylendar = function (svgname, csvdata, attribute) {

    this.attribute = attribute;
    this.svgname = svgname;
    this.data = csvdata;
    this.tagname = attribute.tagname;

    var attribute = this.attribute;
    var svgname = this.svgname;
    var data = this.csvdata;
    var tagname = this.tagname;
    var arrDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    myself = this;

    //決定function
    //初始化，定義svg，
    //定義一開始動畫前圖表。
    var getDay = function (str) {
        return arrDay[(new Date(str)).getDay()];
    }

    var arrMax = function () {
        //return 20000;
        return d3.max(myself.data, function (d) {
            return +d[myself.tagname.value];
        });
    }

    var $color = d3.scale.linear()
        .domain([0, arrMax()])
    if (typeof (myself.attribute.colordomain) == "undefined") {
        $color = $color.domain([0, arrMax()])
    } else {
        $color = $color.domain([myself.attribute.colordomain[0], myself.attribute.colordomain[1]]);
    }
    $color = $color.range([myself.attribute.colorrange[0], myself.attribute.colorrange[1]]);

    this.start = function () {
        divparent = d3.select('#' + svgname);
        divchild = divparent.selectAll('div');
        //console.log(divchild);
        enter = divchild.data(csvdata)
            .enter();
        enter
            .append('div')
            .attr('class', function (d, i) {
                var clame = "";
                clame += " day";
                clame += " t" + d[tagname.tag];
                clame += " " + getDay(d[tagname.tag]);
                clame += " w" + (d.objDate.getWeekday() == 0 ?
                    (d.objDate.getISOWeek() + 1) % 52 : d.objDate.getISOWeek());
                return clame;
            })
            .attr('data-date', function (d, i) {
                return d[tagname.tag];
            })

        .attr('data-weekno', function (d, i) {
            return (d.objDate.getWeekday() == 0 ?
                (d.objDate.getISOWeek() + 1) % 52 : d.objDate.getISOWeek())
        })
            .style('background-color', function (d, i) {
                return $color(d[tagname.value]);
            });

        firstday = (new Date(enter[0][0].__data__[tagname.tag])).getDay();
        $('#' + svgname + ' .day').first().css('margin-left', 5 + firstday * 40);
        console.log(firstday);
        //console.log(enter);
        $('.day').mouseover(function () {
            /*
            $(this).addClass('mouseon');
            //console.log(whylendar.data);
            file = myself.data[$(this).parent().children('.day').index(this)];
            console.log(file);
            d3.selectAll('.t' + file[tagname.tag]).attr('class', function () {
                return d3.select(this).attr('class') + " " + 'mouseon';
            });
            */
            today = d3.select(this).attr('data-date');
            d3.selectAll('.t' + today).classed('mouseon', true);

        }).mouseout(function () {
            today = d3.select(this).attr('data-date');
            d3.selectAll('.t' + today).classed('mouseon', false);
        });

    };

    //開始的動畫。
    this.animate = function () {};

    this.start();

    this.onclick = function (whysto) {

        return function () {
            var thisrect = d3.select(this);
            var thisweek = thisrect.attr('data-weekno');
            whysto.each(function (i) {
                var x = d3.selectAll('#' + i.svgname + ' rect.w' + thisweek).attr('x');
                $('#' + i.svgname).parent().scrollLeft(x);
            });
        }
    };

    this.ctlWhysto = function (whysto) {
        if (typeof (whysto) == "object") {
            d3.selectAll('#' + svgname + ' div').on('click', myself.onclick(whysto));
        } else {
            d3.selectAll('#' + svgname + ' div').on('click', whysto.onclick);
        }
    };


}