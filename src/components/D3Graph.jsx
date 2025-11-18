// D3Graph.jsx
import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

export default function D3Graph({ data }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    const width = 300;
    const height = 120;

    svg.attr("width", width).attr("height", height);

    const maxVal = d3.max(data, (d) => +d || 0) || 1;

    const yScale = d3.scaleLinear().domain([0, maxVal]).range([height, 0]);

    const xScale = d3
      .scaleBand()
      .domain(d3.range(data.length))
      .range([0, width])
      .padding(0.2);

    const bars = svg.selectAll("rect").data(data);

    bars
      .enter()
      .append("rect")
      .merge(bars)
      .attr("x", (d, i) => xScale(i))
      .attr("y", (d) => yScale(+d))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => height - yScale(+d))
      .attr("fill", "steelblue");

    bars.exit().remove();
  }, [data]);

  return <svg ref={svgRef}></svg>;
}

// --- Add to App.js ---
// import D3Graph from "./components/D3Graph";
// Add below the last instrument checkbox row:
// <div className="mt-4 text-center"><D3Graph data={d3Data} /></div>

// And in App.js state section:
// const [d3Data, setD3Data] = useState([]);

// Then update handleD3Data:
// const handleD3Data = (event) => { setD3Data(event.detail); };
