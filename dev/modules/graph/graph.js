/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

 Title:    graph.js

 Author:   David Leclerc

 Version:  0.1

 Date:     14.08.2017

 License:  GNU General Public License, Version 3
 (http://www.gnu.org/licenses/gpl.html)

 Overview: ...

 Notes:    ...

 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

// Imports
import * as lib from "../../assets/js/lib";
import {Bubble} from "../bubble/bubble";
import {Axis} from "./axis/axis";
import {Corner} from "./corner/corner";
import {Inner} from "./inner/inner";
import {Dot} from "./inner/dot/dot";
import {Bar} from "./inner/bar/bar";

export class Graph {

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     CONSTRUCTOR
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    constructor(type) {

        // Get node
        this.self = $(".mod-graph." + type);

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
        const [ x, y ] = data;

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
     BUILDBARS
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    buildBars(type, units, round, format, data) {

        // Destructure data
        const [ x, y ] = data;

        // Reset bar type
        this.bars[type] = [];

        // Build bar elements
        for (let i = 0; i < x.length; i++) {

            // Generate new bar
            let bar = new Bar(type, units, round, format);

            // Define it
            bar.define(x[i], y[i]);

            // Classify it
            bar.classify();

            // Add it to graph
            this.inner.self.append(bar.self);

            // Store it
            this.bars[type].push(bar);
        }
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     SHOWDOTS
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    showDots(type, y0 = null) {

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
     SHOWBARS
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    showBars(type, y0 = 0) {

        // Read measurements
        const dX = this.axes.x.dZ,
              dY = this.axes.y.dZ,
              innerWidth = this.inner.width,
              innerHeight = this.inner.height,
              borderThickness = this.bars[type][0].thickness;

        // Count number of computatable bars
        const n = this.bars[type].length;

        // Initialize bar sizes
        let w = [],
            h = [],
            b = [];

        // Compute bar sizes
        for (let i = 0; i < n; i++) {

            // Initialize bar width and height
            let dw, dh;

            // If last bar
            if (i == n - 1) {

                // Define width
                dw = 0;

                // Define height
                dh = 0;
            }
            // Otherwise
            else {

                // Compute width
                dw = this.bars[type][i + 1].x - this.bars[type][i].x;

                // Read height
                dh = this.bars[type][i].y;
            }

            // Convert to pixels and store them
            w.push(dw / dX * innerWidth);
            h.push(dh / dY * innerHeight);
            b.push((y0 - this.axes.y.min) / dY * innerHeight - borderThickness / 2);
        }

        // Loop on bars
        for (let i = 0; i < n; i++) {

            // Get bar and its content
            const bar = this.bars[type][i],
                  innerBars = bar.self.children();

            // Not first
            if (i != 0) {
                
                // Compute delta between previous and current bar
                let dh = h[i] - h[i - 1];

                // Step with previous bar needs contour
                if (h[i] > 0 && dh > 0 || h[i] < 0 && dh < 0) {

                    // Contour
                    innerBars.first().css("height", Math.abs(dh));
                }
                // Baseline crossed
                else if (h[i - 1] < 0 && h[i] > 0 || h[i - 1] > 0 && h[i] < 0) {

                    // Contour
                    innerBars.first().css("height", "100%");
                }
            }
            
            // Not last
            if (i != n - 1) {

                // Compute delta between current and next bar
                let dh = h[i + 1] - h[i];

                // Step with next bar needs contour
                if (h[i] > 0 && dh < 0 || h[i] < 0 && dh > 0) {

                    // Contour
                    innerBars.last().css("height", Math.abs(dh));
                }
                // Baseline crossed
                else if (h[i] > 0 && h[i + 1] < 0 || h[i] < 0 && h[i + 1] > 0) {

                    // Contour
                    innerBars.last().css("height", "100%");
                }
            }

            // Bars of minor width
            if (w[i] < 2 * borderThickness) {

                // Add minor class
                bar.self.addClass("minor-x");
            }

            // Bars of minor height
            if (Math.abs(h[i]) < 2 * borderThickness) {

                // Only keep one line for minor bars
                h[i] = borderThickness;

                // Add minor class
                bar.self.addClass("minor-y");
            }

            // If low bar
            if (h[i] < 0) {

                // Move bar under baseline and recenter with axis
                b[i] += h[i] + borderThickness;
            }

            // Position bar on graph
            bar.position(w[i], h[i], b[i]);

            // Inform through bubble
            bar.inform(this.bubble);
        }
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     SPACEBARS
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    spaceBars(type) {

        // Get last bar
        const lastBar = lib.last(this.bars[type]);

        // Compute time elapsed between last bar and now
        const dt = this.axes.x.max - lastBar.x;

        // Convert to pixels
        const t = dt / this.axes.x.dZ * this.inner.width;

        // Push bars according to time difference between last bar and now
        lastBar.self.css("margin-right", t);
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

            // Loop on dot types
            for (let dot of this.dots[type]) {

                // Measure them
                dot.measure();
            }
        }

        // Measure bars
        for (let type in this.bars) {

            // Loop on bar types
            for (let bar of this.bars[type]) {

                // Measure them
                bar.measure();
            }
        }
    }

}