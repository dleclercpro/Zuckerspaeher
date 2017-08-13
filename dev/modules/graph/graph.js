// Imports
import * as lib from "../../assets/js/lib";
import {Bubble} from "../bubble/bubble";
import {Inner} from "./inner";
import {Corner} from "./corner";
import {Axis} from "./axis";
import {Dot} from "./dot";
import {Bar} from "./bar";

export class Graph {

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     CONSTRUCTOR
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    constructor(type) {

        // Get node
        this.self = $("#graph-" + type);

        // Define properties
        this.type = type;

        // Give graph a bubble
        this.bubble = new Bubble();

        // Give graph an inner section
        this.inner = new Inner();

        // Give graph a corner section
        this.corner = new Corner();

        // Initialize axes
        this.axes = {};

        // Initialize dots
        this.dots = {};

        // Initialize bars
        this.bars = {};
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     BUILDINNER
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    buildInner() {

        // Append it to graph
        this.self.append(this.inner.self);
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     BUILDCORNER
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    buildCorner() {

        // Append it to graph
        this.self.append(this.corner.self);
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     BUILDAXIS
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    buildAxis(type, z0, dz, dZ, z = [], f = false, offset = 0) {

        // Create axis object
        const axis = new Axis(type);

        // Generate it
        axis.generate(z0, dz, dZ, z);

        // Build it
        axis.build(f, offset);

        // Append to graph
        this.self.append(axis.self);

        // Store it
        this.axes[type] = axis;
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     BUILDDOTS
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    buildDots(type, units, round, format, data) {

        // Destructure data
        const [x, y] = data;

        // Reset dot type
        this.dots[type] = [];

        // Build dot elements
        for (let i = 0; i < x.length; i++) {

            // Generate new dot
            let dot = new Dot(type, units, round, format);

            // Define it
            dot.define(x[i], y[i]);

            // Add it to graph
            this.inner.self.append(dot.self);

            // Store it
            this.dots[type].push(dot);
        }
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     ADDDOTS
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    addDots(type, y0 = null) {

        // Read measurements
        const dX = this.axes.x.dZ,
              dY = this.axes.y.dZ,
              innerWidth = this.inner.width,
              innerHeight = this.inner.height,
              dotRadius = this.dots[type][0].radius,
              xAxisTickThickness = this.axes.x.ticks[0].thickness,
              yAxisTickThickness = this.axes.y.ticks[0].thickness;

        // Loop on dots
        for (let dot of this.dots[type]) {

            // Compute distance with inner extremities
            let dx = dot.x - this.axes.x.min,
                dy = (y0 == null ? dot.y : y0) - this.axes.y.min;

            // Convert to pixels
            let x = dx / dX * innerWidth - dotRadius - xAxisTickThickness / 2,
                y = dy / dY * innerHeight - dotRadius + yAxisTickThickness / 2;

            // Position on graph
            dot.position(x, y);

            // Inform through bubble
            dot.inform(this.bubble);
        }
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     BUILDBARS
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    buildBars(type, data) {

        // Destructure data
        const [x, y] = data;

        // Initialize array for bar elements
        let bars = [];

        // Build bar elements
        for (let i = 0; i < x.length; i++) {

            // Generate bar
            let bar = $("<div class='" + type + "' x=" + x[i] +
                " y=" + y[i] + "></div>");

            // Add sub-elements inside bar
            for (let j = 0; j < 2; j++) {
                bar.append($("<div class='inner-" + type + "'></div>"));
            }

            // Store it
            bars.push(bar);
        }

        // Append dots to inner section of graph
        this.inner.self.append(bars);
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     SHOWBARS
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    showBars(type, units, round, y0) {

        // Get bars
        const bars = this.inner.self.find("." + type);
        const n = bars.length - 1;

        // Get bar styles
        const widthBorder = parseFloat(bars.first().css("border-top-width")) ||
                                parseFloat(bars.first().css("border-bottom-width"));

        // Extract information from bars
        let x = [];
        let y = [];

        for (let bar of bars) {
            x.push(parseFloat($(bar).attr("x")));
            y.push(parseFloat($(bar).attr("y")));
        }

        // Compute space between last bar and now
        const dW = this.xMax - lib.last(x);
        const W = dW / this.dX * this.inner.width;

        // Push bars according to time difference between last bar and now
        this.inner.self.children().last().css("margin-right", W);

        // Compute bar sizes
        let w = [];
        let b = [];

        for (let i = 0; i < n; i++) {
            let dw = x[i + 1] - x[i];

            w[i] = dw / this.dX * this.inner.width;
            y[i] = y[i] / this.dY * this.inner.height;
            b[i] = (y0 - this.yMin) / this.dY * this.inner.height - widthBorder / 2;
        }

        // Style bars
        for (let i = 0; i < n; i++) {

            // Get considered bar
            let bar = bars.eq(i);

            // Define type of bar
            if (y[i] > 0) {
                bar.addClass("high-" + type);
            } else if (y[i] < 0) {
                bar.addClass("low-" + type);
            } else {
                bar.addClass("no-" + type);
            }

            // Push inner bars
            if (y[i] > 0) {
                bar.children().css("margin-bottom", "auto");
            } else if (y[i] < 0) {
                bar.children().css("margin-top", "auto");
            }

            // Draw contours
            // Higher than baseline
            if (y[i] > 0) {
                if (i != 0 && y[i] > y[i - 1]) {
                    bar.children().first().css("height", y[i] - y[i - 1]);
                }

                if (i != n && y[i] > y[i + 1]) {
                    bar.children().last().css("height", y[i] - y[i + 1]);
                }
            }
            // Lower than baseline
            else if (y[i] < 0) {
                if (i != 0 && y[i] < y[i - 1]) {
                    bar.children().first().css("height", Math.abs(y[i] - y[i - 1]));
                }

                if (i != n && y[i] < y[i + 1]) {
                    bar.children().last().css("height", Math.abs(y[i] - y[i + 1]));
                }
            }

            // Baseline crossed
            // From -1 to 1
            if (i != 0 && (y[i - 1] < 0 && y[i] > 0 || y[i - 1] > 0 && y[i] < 0)) {
                bar.children().first().css("height", "100%");
            // From 1 to -1
            } else if (i != n && (y[i + 1] < 0 && y[i] > 0 || y[i + 1] > 0 && y[i] < 0)) {
                bar.children().last().css("height", "100%");
            }

            // Minor bars
            if (Math.abs(y[i]) < 2 * widthBorder) {

                // Remove unnecessary borders and shift bar back to baseline
                if (y[i] >= 0) {
                    bar.css("border-top", "none");
                } else if (y[i] < 0) {
                    bar.css("border-bottom", "none");
                }

                // Only keep one line for minor bars
                y[i] = widthBorder;

                // Remove borders on inner bars
                bar.children().css("border", "none");
            }

            // If low bar
            if (y[i] < 0) {

                // Move bar under baseline
                b[i] += y[i];

                // Recenter bar with axis
                b[i] += widthBorder;
            }

            // Position bars on graph
            bar.css({
                "width": w[i],
                "height": Math.abs(y[i]),
                "margin-bottom": b[i]
            });

            // Show bubble
            bar.on("mouseenter", (e) => {
                this.bubble.update(e.currentTarget, type, units, round, "YYYY.MM.DD - HH:MM:SS");
                this.bubble.show();
            });

            // Hide bubble
            bar.on("mouseleave", (e) => {
                this.bubble.hide();
            });
        }
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     MEASURE
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    measure() {

        // Measure inner section
        this.inner.measure();

        // Measure axes
        for (let type in this.axes) {

            // Measure it
            this.axes[type].measure();
        }

        // Measure dots
        for (let type in this.dots) {

            // Loop on dots
            for (let dot of this.dots[type]) {

                // Measure them
                dot.measure();
            }
        }

        // Measure bars
        for (let type in this.bars) {

            // Loop on bars
            for (let bar of this.bars[type]) {

                // Measure them
                bar.measure();
            }
        }
    }

}

export class GraphBG extends Graph {

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     COLOR
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    color (BGScale) {

        // Color dots
        for (let dot of this.dots["BG"]) {

            // Add class based on rank
            dot.self.addClass(lib.rankBG(dot.y, BGScale));
        }
    }
}

export class GraphI extends Graph {

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     PROFILETBS
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    profileTBs (data, dt = 5 * 60 * 1000) {

        // Store data in separate arrays
        let [t, net] = data;

        // Sort TB times in case they aren't already
        [t, net] = lib.indexSort(t, net);

        // Give user TB profile
        return [t, net];
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     BUILDTBS
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    buildTBs (data) {

        // Build TBs
        this.buildBars("TB", this.profileTBs(data));
    }
}