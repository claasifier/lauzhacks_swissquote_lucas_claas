$(document).ready(function(){
  var actualdata;

  d3.csv("NESTLE\ N.csv", function(data) {
    console.log(data.length);
    actualdata = data;
  });

  var svg = d3.select("#graph1")
    .append("svg")
          .attr("width", 500)
          .attr("height", 500)

  // Set the ranges
  var x = d3.scaleLinear().range([0,600]);
  var y = d3.scaleLinear().range([0,600]);

  // Define the line
  var valueline = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.sales); });

  d3.csv("NESTLE\ N.csv", convert, function(error, data) {

    // Set the dimensions of the canvas / graph
    var margin = {top: 30, right: 20, bottom: 30, left: 50},
    width = 600 - margin.left - margin.right,
    height = 270 - margin.top - margin.bottom;


    // Define the axes
    var xAxis = d3.axisBottom(x);
    var yAxis = d3.axisLeft(y);

      // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.close; })]);

    // Add the valueline path.
    svg.append("path")
        .attr("class", "line")
        .attr("d", valueline(data));

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);


  });


});

function parseDate(date){
  return [parseInt(date.charAt(7)+date.charAt(8)), parseInt(date.charAt(5)+date.charAt(6))]
}

function convert(d) {
  return {
    date: +parseDate(d.TIMESTAMP),
    sales: (+d.VOL)*(+d.PRICE)   // convert string to number
  };
}
