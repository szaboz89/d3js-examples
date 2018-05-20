let margin = {left: 80, right: 20, top: 50, bottom: 100};

let width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

let flag = true;

let t = d3.transition().duration(750);

let svg = d3.select("#chart-area")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

let xAxisGroup = svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")");

let yAxisGroup = svg.append("g")
    .attr("class", "y axis");

// X Scale
let x = d3.scaleBand()
    .range([0, width])
    .padding(0.2);

// Y Scale
let y = d3.scaleLinear()
    .range([height, 0]);

// X Label
svg.append("text")
    .attr("y", height + 50)
    .attr("x", width / 2)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Month");

// Y Label
let yLabel = svg.append("text")
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
        d.profit = +d.profit;
    });

    d3.interval(() => {
        let newData = flag ? data : data.slice(1);
        update(newData);
        flag = !flag
    }, 1000);

    // Run the vis for the first time
    update(data);
});

function update(data) {
    let value = flag ? "revenue" : "profit";

    x.domain(data.map(function (d) {
        return d.month
    }));
    y.domain([0, d3.max(data, function (d) {
        return d[value];
    })]);

    // X Axis
    let xAxisCall = d3.axisBottom(x);
    xAxisGroup.transition(t).call(xAxisCall);

    // Y Axis
    let yAxisCall = d3.axisLeft(y)
        .tickFormat(function (d) {
            return "$" + d;
        });
    yAxisGroup.transition(t).call(yAxisCall);

    // Bars
    // JOIN new data with old elements.
    let rects = svg.selectAll("rect")
        .data(data, function (d) {
            return d.month;
        });

    // EXIT old elements not present in new data.
    rects.exit()
        .attr("fill", "red")
        .transition(t)
        .attr("y", y(0))
        .attr("height", 0)
        .remove();

    // ENTER new elements present in new data.
    rects.enter()
        .append("rect")
        .attr("y", y(0))
        .attr("x", function (d) {
            return x(d.month)
        })
        .attr("height", 0)
        .attr("width", x.bandwidth)
        .attr("fill", "grey")
        // AND UPDATE old elements present in new data.
        .merge(rects)
        .transition(t)
        .attr("x", function (d) {
            return x(d.month)
        })
        .attr("width", x.bandwidth)
        .attr("y", function (d) {
            return y(d[value]);
        })
        .attr("height", function (d) {
            return height - y(d[value]);
        });

    let label = flag ? "Revenue" : "Profit";
    yLabel.text(label);
}