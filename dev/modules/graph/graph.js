// Imports
import * as lib from "../../assets/js/lib";
import {Bubble} from "../bubble/bubble";

class Axis {

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     CONSTRUCTOR
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
     constructor() {

     }

}

class Inner {

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     CONSTRUCTOR
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    constructor() {

    }

}

class Corner {

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     CONSTRUCTOR
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    constructor() {

    }

}

export class Graph {

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     CONSTRUCTOR
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
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
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     GENERATEAXIS
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
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

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     BUILDAXIS
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    buildAxis(z, z0, dz, dZ, label, format) {

        // Create axis node
        let axis = $("<div class='graph-" + label + "-axis'></div>");

        // Build axis based on z0, dz and dZ
        if (z) {

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

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     BUILDCORNER
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    buildCorner() {

        // Append to graph
        this.self.append($("<div class='graph-NA'></div>"));
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     BUILDDOTS
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    buildDots(type, data) {

        // If inside section of graph does not already exist, create it
        let graph = this.self.find(".graph");

        // If graph does not already exist
        if (!graph) {

            // Generate inner section
            graph = ($("<div class='graph'></div>"));

            // Append section to graph
            this.self.append(graph);
        }

        // Store data in separate arrays
        const [x, y] = data;

        // Initialize array for dot elements
        let dots = [];

        // Build dot elements
        for (let i = 0; i < x.length; i++) {

            // Generate dot
            let dot = $("<div class='" + type + "' x='" + x[i] +
                        "' y='" + y[i] + "'></div>");

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

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     SHOWDOTS
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    showDots(type, units, round, y0) {

        // Get inner section in which dots must displayed
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
        const radiusDot = parseFloat(lib.first(dots).outerWidth()) / 2;
        const thicknessXTick = parseFloat(lib.first(xTicks).css("border-left-width") ||
                                          lib.first(xTicks).css("border-right-width"));
        const thicknessYTick = parseFloat(lib.first(yTicks).css("border-top-width") ||
                                          lib.first(yTicks).css("border-bottom-width")); // FIXME

        // Extract information from dots
        let X = [];
        let Y = [];

        for (let dot of dots) {
            X.push(parseFloat(dot.attr("x")));
            Y.push(parseFloat(dot.attr("y")));
        }

        // Compute coordinates of dots
        let x = [];
        let y = [];

        for (let i = 0; i < dots.length; i++) {

            // Compute distance with inner extremities
            let dx = X[i] - this.xMin;
            let dy = y0 ? y0 : Y[i] - this.yMin;

            // Convert to pixels
            x.push(dx / this.dX * graphW - radiusDot - thicknessXTick / 2);
            y.push(dy / this.dY * graphH - radiusDot + thicknessYTick / 2);
        }

        // Position dots on graph
        for (let i = 0; i < dots.length; i++) {

            // Set CSS
            dots.eq(i).css({
                "left": x[i] + "px",
                "bottom": y[i] + "px"
            });
        }

        for (let dot of dots) {

            // When mouse enters dot
            dot.on("mouseenter", (e) => {

                // Update bubble
                this.bubble.update(e.currentTarget, type, units, round);

                // Show bubble
                this.bubble.show();
            });

            // When mouse exits dot
            dot.on("mouseenter", (e) => {

                // Hide bubble
                this.bubble.hide();
            });
        }
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     BUILDBARS
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    buildBars(type, data) {

    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     SHOWBARS
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    showBars(type, units, round, y0) {

    }

}

export class GraphBG extends Graph {

}

export class GraphI extends Graph {

}