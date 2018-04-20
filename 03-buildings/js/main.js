let svg = d3.select("#chart-area")
    .append("svg")
    .attr("width", "400")
    .attr("height", "400");

d3.json("data/buildings.json").then(function (data) {
    data.forEach(function (d) {
        d.height = +d.height;
    });

    let rects = svg.selectAll("rect").data(data);

    let y = d3.scaleLinear()
        .domain([0, 828])
        .range([0, 400]);

    let x = d3.scaleBand()
        .domain(["Burj Khalifa", "Shanghai Tower",
            "Abraj Al-Bait Clock Tower", "Ping An Finance Centre",
            "Lotte World Tower", "One World Trade Center",
            "Guangzhou CTF Finance Center"])
        .range([0, 400])
        .paddingInner(0.3)
        .paddingOuter(0.3);

    rects.enter().append("rect")
        .attr("x", (d) => {
            return x(d.name);
        })
        .attr("y", 50)
        .attr("width", x.bandwidth())
        .attr("height", function (d) {
            return y(d.height);
        })
        .attr("fill", "grey");

}).catch(function (error) {
    console.log(error);
});