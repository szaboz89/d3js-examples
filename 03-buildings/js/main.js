let margin = {left: 100, right: 10, top: 10, bottom: 100};

let width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

let svg = d3.select("#chart-area")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

d3.json("data/buildings.json").then((data) => {
    data.forEach(d => {
        d.height = +d.height;
    });

    let rects = svg.selectAll("rect").data(data);

    let y = d3.scaleLinear()
        .domain([0, d3.max(data, (d) => {
            return d.height;
        })])
        .range([0, height]);

    let x = d3.scaleBand()
        .domain(data.map((d) => {
            return d.name;
        }))
        .range([0, width])
        .paddingInner(0.3)
        .paddingOuter(0.3);

    rects.enter().append("rect")
        .attr("x", (d) => {
            return x(d.name);
        })
        .attr("y", 50)
        .attr("width", x.bandwidth())
        .attr("height", (d) => {
            return y(d.height);
        })
        .attr("fill", "grey");

}).catch((error) => {
    console.log(error);
});