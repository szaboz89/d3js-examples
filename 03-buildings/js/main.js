let margin = {left: 100, right: 10, top: 10, bottom: 150};

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
    .attr("class", "x axis-label")
    .attr("x", width / 2)
    .attr("y", height + 140)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("The word's tallest buildings");

// Y Label
svg.append("text")
    .attr("class", "y axis-label")
    .attr("x", -(height / 2))
    .attr("y", -60)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Height (m)");

d3.json("data/buildings.json").then((data) => {
    data.forEach(d => {
        d.height = +d.height;
    });

    let rects = svg.selectAll("rect").data(data);

    let y = d3.scaleLinear()
        .domain([0, d3.max(data, (d) => {
            return d.height;
        })])
        .range([height, 0]);

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
        .attr("y", (d) => {
            return y(d.height);
        })
        .attr("width", x.bandwidth())
        .attr("height", (d) => {
            return height - y(d.height);
        })
        .attr("fill", "grey");

    let xAxisCall = d3.axisBottom(x);
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0, " + height + ")")
        .call(xAxisCall)
        .selectAll("text")
        .attr("y", "10")
        .attr("x", "-5")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-40)");

    let yAxisCall = d3.axisLeft(y)
        .ticks(3)
        .tickFormat((d) => {
            return d + " m";
        });
    svg.append("g")
        .attr("class", "y-axis")
        .call(yAxisCall);

}).catch((error) => {
    console.log(error);
});