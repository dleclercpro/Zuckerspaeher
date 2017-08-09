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

export class Graph {

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     CONSTRUCTOR
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    constructor(name) {

        // Define graph name
        this.name = name;
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     GENERATEAXIS
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    generateAxis(z0, dz, dZ) {

        // Initialize empty array
        let z = [];

        // Generate axis tick
        for (i = 0; i < (dZ / dz); i++) {
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

            for (i = 0; i < z.length - 1; i++) {

                // Compute delta
                dz = z[i + 1] - z[i];

                // Generate tick
                const tick = $("<div class='graph-" + label + "-axis-tick'>" +
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

            for (i = 0; i < z.length - 1; i++) {

                // Complete step
                dz = z[i + 1] - z[i];

                // Generate tick
                const tick = $("<div class='graph-" + label + "-axis-tick'>" +
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
            axis.children().each(() => {

                // Get time
                let t = $(this).html();

                // Convert time
                t = lib.convertTime(t, format);

                // Set time
                $(this).html(t);
            });
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

    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     SHOWDOTS
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    showDots(type, units, round, y0) {

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