let margin = {left: 80, right: 20, top: 50, bottom: 100};

let width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

let svg = d3.select("#chart-area")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

// X Label
svg.append("text")
    .attr("y", height + 50)
    .attr("x", width / 2)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Month");

// Y Label
svg.append("text")
    .attr("y", -60)
    .attr("x", -(height / 2))
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Revenue");

d3.json("data/revenues.json").then(function (data) {
    // Clean data
    data.forEach(function (d) {
        d.revenue = +d.revenue;
    });

    // X Scale
    let x = d3.scaleBand()
        .domain(data.map(function (d) {
            return d.month
        }))
        .range([0, width])
        .padding(0.2);

    // Y Scale
    let y = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) {
            return d.revenue
        })])
        .range([height, 0]);

    // X Axis
    let xAxisCall = d3.axisBottom(x);
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxisCall);

    // Y Axis
    let yAxisCall = d3.axisLeft(y)
        .tickFormat(function (d) {
            return "$" + d;
        });
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxisCall);

    // Bars
    let rects = svg.selectAll("rect")
        .data(data);

    rects.enter()
        .append("rect")
        .attr("y", function (d) {
            return y(d.revenue);
        })
        .attr("x", function (d) {
            return x(d.month)
        })
        .attr("height", function (d) {
            return height - y(d.revenue);
        })
        .attr("width", x.bandwidth)
        .attr("fill", "grey");
});