import { CONFIG } from './config.js';

export class Scatterplot {
    constructor(containerId, tooltip) {
        this.tooltip = tooltip;
        this.data = [];
        this.dimensions = CONFIG.getResponsiveDimensions();
        this.setupChart(containerId);
        this.setupZoom();
        this.setupResize();
    }

    setupChart(containerId) {
        const { margin, width, height } = this.dimensions;
        
        this.svg = d3.select(`#${containerId}`)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

        // Create main group for zoom/pan
        this.mainGroup = this.svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Create scales
        this.x = d3.scaleLinear().range([0, width]);
        this.y = d3.scaleLinear().range([height, 0]);

        // Create axes
        this.xAxis = this.mainGroup.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0, ${height})`);
        
        this.yAxis = this.mainGroup.append("g")
            .attr("class", "y-axis");

        // Create plot area for data points
        this.plotArea = this.mainGroup.append("g").attr("class", "plot-area");
    }

    setupZoom() {
        this.zoom = d3.zoom()
            .scaleExtent([0.5, 10])
            .on("zoom", (event) => {
                this.handleZoom(event);
            })
            .on("start", () => {
                this.svg.classed("panning", true);
            })
            .on("end", () => {
                if(this.shouldZoom){
                    this.svg.classed("panning", false);
                }
            });
        this.svg.call(this.zoom);
    }

    stopZoomPan() {
        this.svg.on('.zoom', null);
    }

    handleZoom(event) {
        const { transform } = event;
        
        // Apply transform to plot area
        this.plotArea.attr("transform", transform);
        
        // Update axes with zoom
        const newXScale = transform.rescaleX(this.x);
        const newYScale = transform.rescaleY(this.y);
        
        this.xAxis.call(d3.axisBottom(newXScale));
        this.yAxis.call(d3.axisLeft(newYScale));
    }

    resetZoom() {
        this.svg.transition()
            .duration(750)
            .call(this.zoom.transform, d3.zoomIdentity);
    }

    setupResize() {
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    handleResize() {
        this.dimensions = CONFIG.getResponsiveDimensions();
        const { margin, width, height } = this.dimensions;
        
        // Update SVG dimensions
        this.svg
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);
        
        // Update scales
        this.x.range([0, width]);
        this.y.range([height, 0]);
        
        // Update axes positions
        this.xAxis.attr("transform", `translate(0, ${height})`);
        
        // Re-render the chart with current data
        if (this.currentXVal && this.currentYVal) {
            this.updateChart(this.currentXVal, this.currentYVal);
        }
    }

    updateChart(xVal, yVal) {
        this.currentXVal = xVal;
        this.currentYVal = yVal;
        
        if (!this.data.length) return;

        const { width, height } = this.dimensions;

        // Clear previous elements
        this.plotArea.selectAll(".median-gizmo").remove();
        
        // Update domains
        this.x.domain(d3.extent(this.data, d => d[xVal]));
        this.y.domain(d3.extent(this.data, d => d[yVal]));
        
        // Update axes
        this.xAxis.transition().duration(1000).call(d3.axisBottom(this.x));
        this.yAxis.transition().duration(1000).call(d3.axisLeft(this.y));

        // Add median lines
        this.addMedianLines(xVal, yVal, width, height);
        
        // Update data points
        this.updateDataPoints(xVal, yVal);
    }

    addMedianLines(xVal, yVal, width, height) {
        const medianX = d3.median(this.data, d => d[xVal]);
        const medianY = d3.median(this.data, d => d[yVal]);
        
        const xMedianLoc = this.x(medianX);
        const yMedianLoc = this.y(medianY);

        // X median line
        this.plotArea.append("line")
            .attr("class", "median-gizmo")
            .attr("x1", xMedianLoc)
            .attr("x2", xMedianLoc)
            .attr("y1", 0)
            .attr("y2", height)
            .attr("stroke", "rgba(1, 1, 1, 0.5)")
            .attr("stroke-width", 1);

        this.plotArea.append("text")
            .attr("class", "median-gizmo")
            .attr("x", xMedianLoc)
            .attr("y", height + 30)
            .attr("text-anchor", "middle")
            .text("Median");

        // Y median line
        this.plotArea.append("line")
            .attr("class", "median-gizmo")
            .attr("x1", 0)
            .attr("x2", width)
            .attr("y1", yMedianLoc)
            .attr("y2", yMedianLoc)
            .attr("stroke", "rgba(1, 1, 1, 0.5)")
            .attr("stroke-width", 1);

        this.plotArea.append("text")
            .attr("class", "median-gizmo")
            .attr("x", -50)
            .attr("y", yMedianLoc)
            .attr("text-anchor", "middle")
            .text("Median");
    }

    updateDataPoints(xVal, yVal) {
        const imageDimensions = 20;

        // Backup dots
        this.plotArea.selectAll(".dot")
            .data(this.data)
            .join("circle")
            .attr("class", "dot")
            .transition()
            .duration(1000)
            .attr("cx", d => this.x(d[xVal]))
            .attr("cy", d => this.y(d[yVal]))
            .attr("r", 4)
            .attr("fill", "#2f41b5");

        // Images
        this.plotArea.selectAll("image")
            .data(this.data)
            .join("svg:image")
            .attr("class", "armor-image")
            .transition()
            .duration(1000)
            .attr("x", d => this.x(d[xVal]) - imageDimensions / 2)
            .attr("y", d => this.y(d[yVal]) - imageDimensions / 2)
            .attr("width", imageDimensions)
            .attr("height", imageDimensions)
            .attr("href", d => d.image)
            .attr("alt", "image.svg");

        // Hover zones
        this.plotArea.selectAll(".dotHover")
            .data(this.data)
            .join("circle")
            .attr("class", "dotHover")
            .attr("cx", d => this.x(d[xVal]))
            .attr("cy", d => this.y(d[yVal]))
            .attr("r", 8)
            .attr("fill", "rgba(0, 0, 0, 0)")
            .on("mouseenter", (e, d) => this.handleMouseEnter(e, d, xVal, yVal))
            .on("mouseout", () => this.handleMouseExit());
    }

    handleMouseEnter(e, d, xVal, yVal) {
        const sameX = this.data.filter(other => other[xVal] === d[xVal]);
        const sameY = this.data.filter(other => other[yVal] === d[yVal]);
        const allAtPoint = sameX.filter(other => sameY.includes(other));

        if(allAtPoint.length > 5){
            this.stopZoomPan();
        }
        
        this.shouldZoom = allAtPoint.length <= 5;
        this.tooltip.show(allAtPoint, e.clientX, e.clientY);
    }

    handleMouseExit(){
        this.setupZoom();
        this.tooltip.hide()
    }

    setData(data) {
        this.data = data;
    }
}