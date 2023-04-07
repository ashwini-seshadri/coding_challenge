clearData = () => {
  document.getElementById("svg").innerHTML = "";
}
const fetchAndPresentData = (levelOfAmbition = 1) => {
  clearData()
  const margin = {top: 10, right: 100, bottom: 30, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;
  
  var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// append the svg object to the body of the page
  const svg = d3.select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

//Read the data
  d3.csv(`/data?levelOfAmbition=${levelOfAmbition}`).then(function (data) {
    let xExtent = d3.extent(data.map(e => parseInt(e.Year)));
    let yExtant = d3.extent([0, ...data.map(e => parseFloat(e["Cumulative Emissions"]))]);
    
    const xScale = d3.scaleLinear()
      .domain(xExtent)
      .range([0, width]);
    
    const yScale = d3.scaleLinear()
      .domain(yExtant)
      .range([height, 0]);
    
    // List of groups (here I have one group per column)
    const allGroup = ["Cumulative Emissions"]
    
    // A color scale: one color for each group
    const myColor = d3.scaleOrdinal()
      .domain(allGroup)
      .range(d3.schemeSet2);
    
    // Add X axis --> it is years
    const x = d3.scaleLinear()
      .domain(xExtent)
      .range([0, width]);
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));
    
    // Add Y axis
    const y = d3.scaleLinear()
      .domain(yExtant)
      .range([height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y));
    
    const line = svg.append('g')
      .append("path")
      .datum(data)
      .attr("d", d3.line()
        .x(function (d) {
          return x(+parseInt(d.Year))
        })
        .y(function (d) {
          return y(+parseFloat(d["Cumulative Emissions"]))
        })
      )
      .attr("stroke", function (d) {
        return myColor("valueA")
      })
      .style("stroke-width", 4)
      .style("fill", "none");
    
    svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        return xScale(parseInt(d.Year));
      })
      .attr("cy", function (d) {
        return yScale(parseFloat(d["Cumulative Emissions"]));
      })
      .attr("r", 5)
      .style("fill", myColor("valueA"))
      .on("mouseover", function (d) {
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        tooltip.html("Cumulative Emissions: " + d.target.__data__["Cumulative Emissions"])
          .style("left", (d.pageX) + "px")
          .style("top", (d.pageY - 28) + "px");
      })
      .on("mouseout", function (d) {
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      });
  });
  
  // A function that update the chart
  function update(selectedGroup) {
    // Create new data with the selection?
    const dataFilter = data.map(function (d) {
      return {time: d.time, value: d[selectedGroup]}
    })
    // Give these new data to update line
    line
      .datum(dataFilter)
      .transition()
      .duration(1000)
      .attr("d", d3.line()
        .x(function (d) {
          return x(+d.time)
        })
        .y(function (d) {
          return y(+d.value)
        })
      )
      .attr("stroke", function (d) {
        return myColor(selectedGroup)
      })
  }
  
  // When the button is changed, run the updateChart function
  d3.select("#selectButton").on("change", function (event, d) {
    // recover the option that has been chosen
    const selectedOption = d3.select(this).property("value")
    // run the updateChart function with this selected option
    update(selectedOption)
  })
};

[...document.getElementsByName("levelOfAmbition")].map(e => e.addEventListener('click', (event) => {fetchAndPresentData(event.target.value) }))
fetchAndPresentData();