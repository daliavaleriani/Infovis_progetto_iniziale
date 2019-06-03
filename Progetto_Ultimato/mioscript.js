var range_order=["13-17", "18-30", "31-49", "50-64", "65+"];

var margin = {
   top: 30,
   right: 100,
   bottom: 30,
   left: 35
};
var width = 1240 - margin.left - margin.right,
   height = 620 - margin.top - margin.bottom,
   that = this;

var svg =
   d3.select(".social-stats-order").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")"
   );

d3.json("data.json", function (error, data) {
   // Transpose the data into layers
   var dataset = d3.layout.stack()(range_order.map(function (stat) {
      return data.map(function (d) {
         return { name: d.Nome, y: +d[stat], current: stat };
      });
   }));

   // Set x, y and colors
   var x = d3.scale.ordinal()
      .domain(dataset[0].map(function (d) { return d.name; }))
      .rangeRoundBands([0, width], .4);

   var y = d3.scale.linear()
      .domain([0, 100])
      .range([height, 0]);

   var colors = ["#00A0E5", "#FFAE10", "#66CDAA", "#D9223A", "#AB5C9B"];


   // Define and draw axes
   var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(10)
      .tickSize(-width, 0, 0)
      .tickFormat(function (d) { return d });

   var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

   svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

   svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);


   // Create groups for each series, rects for each segment
   var groups = svg.selectAll(".value")
      .data(dataset)
      .enter().append("g")
      .attr("id", function (d, i) {
         return range_order[i];
      })
      .style("fill", function (d, i) {
         return colors[i];
      })

   var rect = groups.selectAll("rect")
      .data(function (d) {
         return d;
      })
      .enter()
      .append("rect")
      .attr("x", function (d) {
         return x(d.name);
      })
      .attr("y", function (d) {
         return y(d.y0 + d.y);
      })
      .attr("height", function (d) {
         return y(d.y0) - y(d.y0 + d.y);
      })
      .attr("width", x.rangeBand())
      .on("mouseover", function () {
         d3.select(this).transition().style("opacity", 0.5);
         d3.select(this).attr("stroke", "Black").attr("stroke-width", 0.85);

      })
      .on("mouseout", function () {
         d3.select(this).transition().style("opacity", 1);
         d3.select(this).attr("stroke", "pink").attr("stroke-width", 0.4);

      })
      .on("mousemove", function (d) {
         var xPosition = d3.mouse(this)[0] - 15;
         var yPosition = d3.mouse(this)[1] - 25;

      })
      .on("click", function (d) {
         change(d);
      })


   // Draw legend
   var legend = svg.selectAll(".legend")
      .data(colors)
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function (d, i) {
         return "translate(" + i * -70 + ",286)";
      })


   legend.append("rect")
      .attr("x", width - 453)
      .attr("width", 10)
      .attr("y", 295)
      .attr("height", 10)
      .style("fill", function (d, i) {
         return colors.reverse().slice()[i];
      })

   legend.append("text")
      .attr("x", width - 435)
      .attr("y", 300)
      .attr("width", 30)
      .attr("dy", ".30em")
      .style("text-anchor", "start")
      .style('font-size', '11px')
      .text(function (d, i) {
         switch (i) {
            case 0: return "65+";
            case 1: return "18-30";
            case 2: return "31-49";
            case 3: return "50-64";
            case 4: return "13-17";
         }
      });
   //animation function
   function change(d) {
      var range = d.current;
      var name = d.name;
      var i = range_order.indexOf(range);
      if (i < 4) {
         var range_up = range_order[i + 1];
         var elems = d3.select("[id='" + range + "']")
            .selectAll("rect")
            .attr("y", function (d, i) {
               return d3.select("[id='" + range_up + "']").selectAll("rect")[0][i].attributes[1].value;
            });

         var elems_up = d3.select("[id='" + range_up + "']")
            .selectAll("rect")
            .attr("y", function (d, i) {
               var height = d3.select("[id='" + range + "']").selectAll("rect")[0][i].attributes[2].value;
               return +d3.select(this).attr("y") + +height;
            })
         range_order[i] = range_up;
         range_order[i + 1] = range;
      }


   }
});

