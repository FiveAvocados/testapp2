//apptest_2
import logo from "./logo.svg";
import "./App.css";
import data from "./data.json";
import mapping from "./datamap";
import React, { useRef, useEffect } from "react";
import { select } from "d3";
import * as d3 from "d3";
/* eslint-disable */
// @ts-ignore
import { textwrap } from "d3-textwrap";
/* eslint-enable */
//https://stackoverflow.com/questions/54949876/create-react-app-typescript-does-not-load-d-ts-file

//const textwrap = require("d3-textwrap");
console.log("d3", d3);
const data_ = mapping(data);
console.log("Data after rearranged");
console.log(data_);

function App() {
  const svgRef = useRef();

  useEffect(() => {
    const topics = [];
    let width = 500;
    let height = 500;

    data_.forEach(function (d) {
      if (topics.includes(d.topic)) {
      } else {
        topics.push(d.topic);
      }
    });

    const numClusters = topics.length;

    let color = d3
      .scaleSequential()
      .domain([0, topics.length])
      .interpolator(d3.interpolateRainbow);

    let simulation = d3
      .forceSimulation()
      .force("charge", d3.forceManyBody())
      .nodes(data_)
      .force("collide", d3.forceCollide(30));

    let clusters = d3
      .scalePoint()
      .domain(d3.range(numClusters))
      .range([100, height - 100]);

    const svg = select(svgRef.current);

    svg
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 500 500")
      .classed("svg-content-responsive", true)
      .attr("transform", "translate(295, 115)");

    svg
      .selectAll("rect")
      .data(data_)
      .join(
        (enter) => enter.append("rect"),
        (update) => update.attr("class", "updated"),
        (exit) => exit.remove()
      )
      .attr("width", 50)
      .attr("height", 50)
      .attr("class", "rect")
      .attr("fill", function (d) {
        return color(topics.indexOf(d.topic));
      });

    svg
      .selectAll("text")
      .data(data_)
      .join((enter) =>
        enter
          .append("foreignObject")
          .append("div")
          .text(function (d) {
            return d.quote;
          })
      )
      .attr("font-family", "Helvetica Neue")
      .attr("font-size", "5")
      .attr("fill", "black")
      .attr("id", "text")
      .attr("width", 30);

    simulation.on("tick", ticked);

    function ticked() {
      //var k = this.alpha() * 0.3;
      var k = this.alpha() * 0.2;
      //move the nodes to their foci/cluster
      data_.forEach(function (n, i) {
        //console.log("Topicnum");
        //console.log(clusters(n.topic_num));
        n.y += (clusters(n.topic_num) - n.y) * k;
        n.x += (0 - n.x) * k;
      });

      //update coordinates for the rect
      d3.selectAll(".rect")
        .attr("x", function (d) {
          return d.x + 100;
        })
        .attr("y", function (d) {
          return d.y;
        });

      d3.selectAll("#text")
        .attr("x", function (d) {
          return d.x + 100;
        })
        .attr("y", function (d) {
          return d.y;
        });

      d3.selectAll("#text")
        .attr("x", function (d) {
          return d.x + 100;
        })
        .attr("y", function (d) {
          return d.y;
        });
    }

    function wrap(text) {
      text.each(function () {
        var text = d3.select(this);
        var words = text.text().split(/\s+/).reverse();
        var lineHeight = 7;
        //The parseFloat() function parses a string argument and returns a floating point number.
        var width = parseFloat(text.attr("width"));
        var y = parseFloat(text.attr("y"));
        var x = text.attr("x");
        var anchor = text.attr("text-anchor");
        //console.log("_____");
        //console.log(this.getStartPositionOfChar(0));
        //console.log(text);
        //console.log(y);

        var tspan = text
          .text(null)
          .append("tspan")
          .attr("x", x)
          .attr("y", y)
          .attr("text-anchor", anchor);
        var lineNumber = 0;
        var line = [];
        var word = words.pop();

        while (word) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
            lineNumber += 1;
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text
              .append("tspan")
              .attr("x", x)
              .attr("y", y + lineNumber * lineHeight)
              .attr("anchor", anchor)
              .text(word);
          }
          word = words.pop();
        }
      });
    }

    //d3.selectAll("#text").call(wrap);
  }, [data_]);

  return (
    <React.Fragment>
      <svg ref={svgRef}> </svg>
    </React.Fragment>
  );
}

export default App;
