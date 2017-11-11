$(document).ready(function(){
  // Set the dimensions of the canvas / graph
  var margin = {top: 20, right: 20, bottom: 30, left: 50},
  width = 1200 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

  // append the svg obgect to the body of the page
  // appends a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  // Set the ranges
  var x = d3.scaleTime().range([0,width]);
  var y = d3.scaleLinear().range([height,0]);

  // Define the line
  var valueline = d3.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.sales); });

  d3.csv("companies_prices.csv", function(error, data) {
    if (error) throw error;

    var company1 = data[0].NAME;
    var company2 = "notyet";
    // format the data
    data.forEach(function(d) {
      if (d.NAME == company1 || d.NAME == company2){
        d.date = +parseDate(d.TIMESTAMP);
        d.sales = (+d.VOL)*(+d.PRICE);
      }
      else if (company2 == "notyet"){
        d.date = +parseDate(d.TIMESTAMP);
        d.sales = (+d.VOL)*(+d.PRICE);
        company2 = d.NAME;
        console.log(d.NAME);
      }
    });


    var company1 = data.filter(function(e){
      return e.NAME == company1;
    });


    var company2 = data.filter(function(f){
      return f.NAME == company2;
    });

    // Scale the range of the data
    x.domain([6, 13]);
    y.domain([0, 2000000]);

    //Add the valueline path.

    svg.selectAll("dot")
        .data(company1)
      .enter().append("circle")
        .attr("cx", function(d) { return x(d.date); })
        .attr("cy", function(d) { return y(d.sales); })
        .attr("r", 1)
        .attr("fill", "red");

    svg.selectAll("dot")
        .data(company2)
      .enter().append("circle")
        .attr("cx", function(d) { return x(d.date); })
        .attr("cy", function(d) { return y(d.sales); })
        .attr("r", 1)
        .attr("fill", "blue");

    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisTop(x));

    // Add the Y Axis
    svg.append("g")
        .call(d3.axisRight(y));


  });
});

function parseDate(date){
  var clockTime = parseFloat((" "+date.charAt(8)+date.charAt(9)+date.charAt(10)+date.charAt(11)+date.charAt(12)+date.charAt(13)));
  var decTime = clockTime/240000;
  var date = (""+date.charAt(6)+date.charAt(7));

  return (parseFloat(date)+decTime)
}
