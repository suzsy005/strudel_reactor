import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

export default function D3Graph({ data }) {
  const svgRef = useRef(null);

  // takes a number
  const toNumber = (d) => {
    const match = (d + "").match(/-?\d+(\.\d+)?/); // takes only numbers
    return match ? parseFloat(match[0]) : 0;
  };

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);

    // do not set the size, adjust to the parent size
    const width = svgRef.current.clientWidth || 300;
    const height = svgRef.current.clientHeight || 120;

    svg.attr("width", width).attr("height", height);

    
    const numericData = data.map(toNumber);

    // scale
    const maxVal = d3.max(numericData) || 1;

    const yScale = d3.scaleLinear().domain([0, maxVal]).range([height, 0]);

    const xScale = d3
      .scaleBand()
      .domain(d3.range(numericData.length))
      .range([0, width])
      .padding(0.2);

    // designs bars
    const bars = svg.selectAll("rect").data(numericData);

    bars
      .enter()
      .append("rect")
      .merge(bars)
      .transition()
      .duration(150)
      .attr("x", (_, i) => xScale(i))
      .attr("y", (d) => yScale(d))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => height - yScale(d))
      .attr("fill", "steelblue");

    bars.exit().remove();
  }, [data]);

  // set the size 100% becuase the parents set the size
  return (
    <svg
      ref={svgRef}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
      }}
    ></svg>
  );
}
