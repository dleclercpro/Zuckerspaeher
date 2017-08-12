// Imports
import {Tick} from "./tick";

export class Axis {

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     CONSTRUCTOR
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    constructor(type) {

        // Generate node
        this.self = $("<div class='graph-" + type + "-axis'></div>");

        // Define properties
        this.type = type;

        // Initialize properties
        this.z = [];
        this.dZ = null;
        this.min = null;
        this.max = null;

        // Initialize ticks
        this.ticks = [];
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     DEFINE
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    define(z = []) {
        
        // Compute and store infos about axis
        this.z = z;
        this.min = Math.min(...this.z);
        this.max = Math.max(...this.z);
        this.dZ = this.max - this.min;
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
     BUILD
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    build(f = false, offset = 0) {

        // Build ticks
        for (let i = 0; i < this.z.length - 1; i++) {

            // Generate new tick
            const tick = new Tick(this.type);

            // Fill it
            tick.fill(this.z[i + offset])

            // Style it
            tick.style(this.z[i + 1] - this.z[i], this.dZ);

            // Format it
            if (f) tick.format(f);

            // Store it
            this.ticks.push(tick);

            // Add it to axis
            this.self.append(tick.self);
        }
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     SHARE
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    share(axis) {

        // Share axis properties
        axis.define(this.z);
    }

}