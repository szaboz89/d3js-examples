var svg = d3.select("#chart-area")
    .append("svg")
    .attr("width", "400")
    .attr("height", "400");

d3.json("data/buildings.json").then(function (data) {
    data.forEach(function (d) {
        d.height = +d.height;
    });

    var rects = svg.selectAll("rect").data(data);

    var y = d3.scaleLinear()
        .domain([0, 828])
        .range([0, 400]);

    rects.enter().append("rect")
        .attr("x", function (d, i) {
            return (i * 60);
        })
        .attr("y", 50)
        .attr("width", 40)
        .attr("height", function (d) {
            return y(d.height);
        })
        .attr("fill", "grey");

}).catch(function (error) {
    console.log(error);
});