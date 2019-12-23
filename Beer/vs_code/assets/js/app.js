// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

console.log("right before csv")
// Import Data
d3.csv("./assets/data/beerdata.csv").then(function (ibuAlcohol) {
    console.log("right after csv");
    console.log(ibuAlcohol[0]);

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    ibuAlcohol.forEach(function (data) {
        data.abv = +data.abv;
        data.ibu = +data.ibu;
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
        // .domain([0, d3.max(ibuAlcohol, d => d.abv)])
        .domain([0, 20])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        // .domain([0, d3.max(ibuAlcohol, d => d.ibu)])
        .domain([0, 300])
        .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .attr("class", "axisX")
        .call(bottomAxis);

    chartGroup.append("g")
        .attr("class", "axisY")
        .call(leftAxis);

    console.log("right before Step 5")
    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
        .data(ibuAlcohol)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.abv))
        .attr("cy", d => yLinearScale(d.ibu))
        .attr("r", "15")
        .attr("fill", "blue")
        .attr("stroke-width", 2)
        .attr("stroke", "green")
        .attr("opacity", ".5");

    var circleLabels = chartGroup.selectAll(null).data(ibuAlcohol).enter().append("text");

    circleLabels
        .attr("x", function (d) {
            return xLinearScale(d.abv);
        })
        .attr("y", function (d) {
            return yLinearScale(d.ibu);
        })
        // .text(function (d) {
        //     return d.name;
        // })
        .attr("font-family", "sans-serif")
        .attr("font-size", "10px")
        .attr("text-anchor", "middle")
        .attr("fill", "black");

    console.log("right before Step 6")
    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -80])
        .html(function (d) {
            return (`<strong>${d.name}<hr>Alcohol ABV: ${d.abv}%<br>IBU: ${d.ibu}<br>Color: ${d.srm_category}`);
        });

    console.log("right before Step 7")
    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    console.log("right before Step 8")
    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("mouseover", function (data) {
        toolTip.show(data, this);
    })
        // onmouseout event
        .on("mouseout", function (data, index) {
            toolTip.hide(data);
        });

    // Create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        // .attr("text", "green")
        .text("IBU Rating");

    console.log("middle of axis labels")
    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisTexxt")
        .text("Alcohol Level (%)");
});