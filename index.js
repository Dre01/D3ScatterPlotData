//Create DIMENSIONS
let HEIGHT = 500,
  WIDTH = 500,
  MARGIN = { top: 20, right: 0, bottom: 20, left: 20 };

//Create SVG
let svg = d3
  .select("#dataViz")
  .append("svg")
  .attr("width", WIDTH + MARGIN.left + MARGIN.right)
  .attr("height", HEIGHT + MARGIN.top + MARGIN.bottom)
  .append("g")
  .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`);

//DATA + IMPLEMENT
d3.csv(
  "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_connectedscatter.csv"
).then((data) => {
  //Insert Selects
  let selectOptions = ["valueA", "valueB", "valueC"];
  d3.select("#dropDownButton")
    .selectAll("myOptions")
    .data(selectOptions)
    .enter()
    .append("option")
    .text(function (d) {
      return d;
    })
    .attr("value", function (d) {
      return d;
    });

  //Create Y-AXIS
  var yScale = d3.scaleLinear().domain([0, 20]).range([HEIGHT, 0]);
  svg.append("g").call(d3.axisLeft(yScale));

  //Create X-AXIS
  var xScale = d3.scaleLinear().domain([0, 10]).range([0, WIDTH]);
  svg
    .append("g")
    .attr("transform", `translate(0,${HEIGHT})`)
    .call(d3.axisBottom(xScale));

  //Draw POINTS
  //Start with group A
  let line = svg
    .append("g")
    .append("path")
    .datum(data)
    .attr(
      "d",
      d3
        .line()
        .x((d) => xScale(d.time))
        .y((d) => yScale(d.valueA))
    )
    .attr("stroke", "black")
    .style("stroke-width", 4)
    .style("fill", "none");

  //Initialize dots with group A
  let dot = svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(d.time))
    .attr("cy", (d) => yScale(d.valueA))
    .attr("r", 3)
    .style("fill", "slategrey");

  function updateGraphs(selectedOption) {
    //new data
    let newData = data.map(function (d) {
      return { time: d.time, value: d[selectedOption] };
    });

    //update line
    line
      .datum(newData)
      .transition()
      .duration(1000)
      .attr(
        "d",
        d3
          .line()
          .x((d) => xScale(d.time))
          .y((d) => yScale(d.value))
      );

    dot
      .data(newData)
      .transition()
      .duration(1000)
      .attr("cx", (d) => xScale(d.time))
      .attr("cy", (d) => yScale(d.value));
  }

  //Change Option
  d3.select("#dropDownButton").on("change", function (d) {
    //get the option that was chosen
    let selectedOption = d3.select(this).property("value");
    //update chart
    updateGraphs(selectedOption);
  });
});
