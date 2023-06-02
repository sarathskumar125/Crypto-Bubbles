import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import Swal from "sweetalert2";

const BubbleChart = ({ data, data2 }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const width = "700";
    const height = "400";

    const handleClick = (d) => {
      const Title = d.target.__data__.title;
      const result = data2.filter((x) => x.symbol === Title);
      console.log(result);
      Swal.fire({
        background: "black",
        html: `<img src="${
          result[0].image
        }" alt="My Image" style="max-width: 80px;">
        <h2>${result[0].name}<h2>
        <h5>Market Rank : ${result[0].market_cap_rank} </H5>
        <h5>Current Price : $ ${result[0].current_price} </H5>
        <h5>Market Cap : $ ${(result[0].market_cap / 1e9).toFixed(2)} B </H5> 
        <h5>24h Volume : $ ${(result[0].total_volume / 1e6).toFixed(2)} M </H5> 
        `,
        confirmButtonText: "close",
        customClass: {
          container: "custom-swal", // Add the custom CSS class to the container
        },
      });
    };

    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", "100%")
      .attr("height", "115vh");

    const simulation = d3
      .forceSimulation(data)
      .force("charge", d3.forceManyBody().strength(-2))
      .force("center", d3.forceCenter(width, height))
      .force(
        "collision",
        d3.forceCollide().radius((d) => d.r + 2)
      )
      .on("tick", () => {
        bubbles.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
        images.attr("x", (d) => d.x - d.r / 2).attr("y", (d) => d.y - d.r / 2);
        labels
          .attr("x", (d) => d.x)
          .attr("y", (d) => d.y + d.r / 2 + 10)
          .attr("text-anchor", "middle");
        svg
          .selectAll(".bubble")
          .attr("cx", (d) => d.x)
          .attr("cy", (d) => d.y);
      });

    const bubbles = svg
      .selectAll(".bubble")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "bubble")
      .on("click", handleClick)
      .attr("r", (d) => d.r)
      .style("fill", "white")
      .style("opacity", 0.2)
      .style("stroke", "yellow") // Set the border color
      .style("stroke-width", "2px") // Set the border width
      .append("title")
      .text((d) => d.title)
      .attr("cx", width / 2)
      .attr("cy", height / 2);

    const labels = svg
      .selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label")
      .on("click", handleClick)
      .text((d) => d.title)
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y + d.r / 2 + 10)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .style("fill", "white"); // Set the text color to white

    const images = svg
      .selectAll(".image")
      .data(data)
      .enter()
      .append("image")
      .attr("class", "image")
      .on("click", handleClick)
      .attr("xlink:href", (d) => d.imageSrc)
      .attr("x", (d) => d.x - d.r / 2)
      .attr("y", (d) => d.y - d.r / 2)
      .attr("width", (d) => d.r)
      .attr("height", (d) => d.r)
      .style("object-fit", "cover");



      

        // Function to update the chart based on screen size
        const updateChart = () => {
          const width = chartRef.current.offsetWidth;
          const height = chartRef.current.offsetHeight;
    
          // Update chart dimensions
          svg.attr('width', width).attr('height', height);
    
          // Add code to update the bubble chart based on new dimensions
          // ...
        };
    
        // Initial chart setup
        updateChart();
    
        // Update chart on window resize
        window.addEventListener('resize', updateChart);


    return () => {
      // Cleanup function to remove the SVG element when component unmounts
      svg.remove();
    };
  }, [data, data2]);

  return <div ref={chartRef} style={{ width: "100%" }} />;
};

export default BubbleChart;
