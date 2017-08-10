// Imports
import * as lib from "../../assets/js/lib";
import {Bubble} from "../bubble/bubble";

class Axis {

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     CONSTRUCTOR
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
     constructor() {

     }

}

class Inner {

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     CONSTRUCTOR
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    constructor() {

    }

}

class Corner {

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     CONSTRUCTOR
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    constructor() {

    }

}

export class Graph {

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     CONSTRUCTOR
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    constructor(name) {

        // Get object in DOM
        this.self = $("#graph-" + name);

        // Define graph name
        this.name = name;

        // Initialize properties
        this.x = null;
        this.dX = null;
        this.xMin = null;
        this.xMax = null;
        this.y = null;
        this.dY = null;
        this.yMin = null;
        this.yMax = null;

        // Give graph a bubble
        this.bubble = new Bubble();

        // Give graph an inner section
        this.buildInner();
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     GENERATEAXIS
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    generateAxis(z0, dz, dZ) {

        // Initialize empty array
        let z = [];

        // Generate axis tick
        for (let i = 0; i < (dZ / dz); i++) {
            z.unshift(z0 - i * dz);
        }

        // Add last tick based on given dZ
        z.unshift(z0 - dZ);

        return z;
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     BUILDAXIS
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    buildAxis(z, z0, dz, dZ, label, format) {

        // Create axis node
        let axis = $("<div class='graph-" + label + "-axis'></div>");

        // Build axis based on z0, dz and dZ
        if (z.length == 0) {

            // Generate axis
            z = this.generateAxis(z0, dz, dZ);

            for (let i = 0; i < z.length - 1; i++) {

                // Compute delta
                dz = z[i + 1] - z[i];

                // Generate tick
                let tick = $("<div class='graph-" + label + "-axis-tick'>" +
                               z[i + 1] + "</div>");

                // Style it
                tick.css("width", (dz / dZ * 100) + "%");

                // Append it to axis
                axis.append(tick);
            }
        }

        // Build axis based on provided z array
        else {

            // Compute total step
            dZ = Math.max(...z) - Math.min(...z);

            for (let i = 0; i < z.length - 1; i++) {

                // Complete step
                dz = z[i + 1] - z[i];

                // Generate tick
                let tick = $("<div class='graph-" + label + "-axis-tick'>" +
                               z[i] + "</div>");

                // Style it
                tick.css("height", (dz / dZ * 100) + "%");

                // Append it to axis
                axis.append(tick);
            }
        }

        // Format axis ticks if desired
        if (format) {

            // Convert every tick
            for (let tick of axis.children()) {

                // Make it a jQuery object
                tick = $(tick);

                // Get time
                let t = tick.html();

                // Convert time
                t = lib.convertTime(t, format);

                // Set time
                tick.html(t);
            }
        }

        // If x-axis
        if (label == "x") {

            // Store infos on axis
            this.x = z;
            this.dX = dZ;
            this.xMin = Math.min(...z);
            this.xMax = Math.max(...z);

            // Add dead corner
            this.buildCorner();
        }
        // If y-axis
        else if (label == "y") {
            
            // Store infos on axis
            this.y = z;
            this.dY = dZ;
            this.yMin = Math.min(...z);
            this.yMax = Math.max(...z);
        }

        // Append axis to graph
        this.self.append(axis);
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     BUILDINNER
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    buildInner() {

        // Append to graph
        this.self.append($("<div class='graph'></div>"));
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     BUILDCORNER
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    buildCorner() {

        // Append to graph
        this.self.append($("<div class='graph-NA'></div>"));
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     BUILDDOTS
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    buildDots(type, data) {

        // If inside section of graph does not already exist, create it
        const graph = this.self.find(".graph");

        // Destructure data
        const [x, y] = data;

        // Initialize array for dot elements
        let dots = [];

        // Build dot elements
        for (let i = 0; i < x.length; i++) {

            // Generate dot
            let dot = $("<div class='" + type + "' x=" + x[i] +
                        " y=" + y[i] + "></div>");

            // Note first
            if (i == 0) {
                dot.addClass("first-" + type);
            }
            // Note last
            else if (i == x.length - 1) {
                dot.addClass("last-" + type);
            }

            // Store it
            dots.push(dot);
        }

        // Append dots to inner section of graph
        graph.append(dots);
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     SHOWDOTS
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    showDots(type, units, round, y0) {

        // Get inner section of graph
        const graph = this.self.find(".graph");

        // Get graph dimensions
        const graphW = graph.outerWidth();
        const graphH = graph.outerHeight();

        // Get axis ticks
        const xTicks = $(".graph-x-axis-tick");
        const yTicks = $(".graph-y-axis-tick");

        // Get dots
        const dots = graph.find("." + type);

        // Get dot styles
        const radiusDot = parseFloat($(lib.first(dots)).outerWidth()) / 2;
        const thicknessXTick = parseFloat($(lib.first(xTicks)).css("border-left-width") ||
                                          $(lib.first(xTicks)).css("border-right-width"));
        const thicknessYTick = parseFloat($(lib.first(yTicks)).css("border-top-width") ||
                                          $(lib.first(yTicks)).css("border-bottom-width")); // FIXME

        // Extract information from dots
        let X = [];
        let Y = [];

        for (let dot of dots) {
            X.push(parseFloat($(dot).attr("x")));
            Y.push(typeof(y0) == "number" ? y0 : parseFloat($(dot).attr("y")));
        }

        // Compute coordinates of dots
        let x = [];
        let y = [];

        for (let i = 0; i < dots.length; i++) {

            // Compute distance with inner extremities
            let dx = X[i] - this.xMin;
            let dy = Y[i] - this.yMin;

            // Convert to pixels
            x.push(dx / this.dX * graphW - radiusDot - thicknessXTick / 2);
            y.push(dy / this.dY * graphH - radiusDot + thicknessYTick / 2);
        }

        // Position dots on graph
        for (let i = 0; i < dots.length; i++) {

            // Set CSS
            dots.eq(i).css({
                "left": x[i],
                "bottom": y[i]
            });
        }

        for (let dot of dots) {

            // When mouse enters dot
            $(dot).on("mouseenter", (e) => {

                // Update bubble
                this.bubble.update(e.currentTarget, type, units, round, "YYYY.MM.DD - HH:MM:SS");

                // Show bubble
                this.bubble.show();
            });

            // When mouse exits dot
            $(dot).on("mouseleave", (e) => {

                // Hide bubble
                this.bubble.hide();
            });
        }
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     BUILDBARS
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    buildBars(type, data) {

        // If inside section of graph does not already exist, create it
        const graph = this.self.find(".graph");

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

            // Note first
            if (i == 0) {
                bar.addClass("first-" + type);
            }
            // Note last
            else if (i == x.length - 1) {
                bar.addClass("last-" + type);
            }

            // Store it
            bars.push(bar);
        }

        // Append dots to inner section of graph
        graph.append(bars);
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     SHOWBARS
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    showBars(type, units, round, y0) {

        // Get inner section of graph
        const graph = this.self.find(".graph");

        // Get graph dimensions
        const graphW = graph.outerWidth();
        const graphH = graph.outerHeight();

        // Get bars
        const bars = graph.find("." + type);
        const n = bars.length - 1;

        // Get bar styles
        const thicknessBorder = parseFloat(bars.first().css("border-top-width")) ||
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
        const W = dW / this.dX * graphW;

        // Push bars according to time difference between last bar and now
        graph.children().last().css("margin-right", W);

        // Compute bar sizes
        let w = [];
        let b = [];

        for (let i = 0; i < n; i++) {
            let dw = x[i + 1] - x[i];

            w[i] = dw / this.dX * graphW;
            y[i] = y[i] / this.dY * graphH;
            b[i] = (y0 - this.yMin) / this.dY * graphH - thicknessBorder / 2;
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
            if (Math.abs(y[i]) < 2 * thicknessBorder) {

                // Remove unnecessary borders and shift bar back to baseline
                if (y[i] >= 0) {
                    bar.css("border-top", "none");
                } else if (y[i] < 0) {
                    bar.css("border-bottom", "none");
                }

                // Only keep one line for minor bars
                y[i] = thicknessBorder;

                // Remove borders on inner bars
                bar.children().css("border", "none");
            }

            // If low bar
            if (y[i] < 0) {

                // Move bar under baseline
                b[i] += y[i];

                // Recenter bar with axis
                b[i] += thicknessBorder;
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

}

export class GraphBG extends Graph {

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     COLORBGS
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    colorBGs (BGScale) {

        // Get inner graph section
        const graph = this.self.find(".graph");

        // Get BGs
        const BGs = graph.find(".BG");

        // Color BGs
        for (let i = 0; i < BGs.length; i++) {

            // Read BG value
            let BG = parseFloat(BGs.eq(i).attr("y"));

            // Add class based on rank
            BGs.eq(i).addClass(lib.rankBG(BG, BGScale));
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