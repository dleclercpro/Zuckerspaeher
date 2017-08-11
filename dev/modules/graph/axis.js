// Imports
import * as lib from "../../assets/js/lib";

export class Axis {

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     CONSTRUCTOR
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    constructor(name) {

        // Initialize properties
        this.z = [];
        this.dZ = null;
        this.min = null;
        this.max = null;

        // Define properties
        this.name = name;

        // Generate node
        this.self = $("<div class='graph-" + name + "-axis'></div>");

    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     GENERATE
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    generate(z0, dz, dZ, z = []) {

        // No axis given
        if (z.length == 0) {

            // Generate axis tick
            for (let i = 0; i < (dZ / dz); i++) {

                // Store it
                z.unshift(z0 - i * dz);
            }

            // Add last tick based on given dZ
            z.unshift(z0 - dZ);
        }

        // Update axis infos
        this.define(z);
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     DEFINE
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    define(z = []) {

        // If axis given
        if (z.length != 0) {

            // Store it
            this.z = z;

        }

        // Compute and store infos about axis
        this.min = Math.min(...this.z);
        this.max = Math.max(...this.z);
        this.dZ = this.max - this.min;
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     SHARE
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    share(axis) {

        // Share axis properties
        axis.define(this.z);
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     FORMAT
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    format(f) {

        // Convert every tick
        for (let tick of this.self.children()) {

            // Make it a jQuery object
            tick = $(tick);

            // Get and convert time
            let t = lib.convertTime(tick.html(), f);

            // Set time
            tick.html(t);
        }
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     BUILD
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    build(f = false, offset = 0) {

        // Loop on axis values
        for (let i = 0; i < this.z.length - 1; i++) {

            // Compute delta
            let dz = this.z[i + 1] - this.z[i];

            // Generate tick
            let tick = $("<div class='graph-" + this.name + "-axis-tick'>" + this.z[i + offset] +
                         "</div>");

            // Define default property to style
            let property = "width";

            // If y-axis
            if (this.name == "y") {

                // Define property
                property = "height";

            }

            // Style it
            tick.css(property, (dz / this.dZ * 100) + "%");

            // Append it to axis
            this.self.append(tick);
        }

        // If desired
        if (f) {

            // Format axis ticks
            this.format(f);
        }
    }

}