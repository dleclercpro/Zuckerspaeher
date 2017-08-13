// Imports
import * as lib from "../../assets/js/lib";

export class Tick {

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     CONSTRUCTOR
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    constructor(type) {

        // Generate node
        this.self = $("<div class='graph-" + type + "-axis-tick'></div>");

        // Define properties
        this.type = type;

        // Define styling property
        this.property = (type == "x") ? "width" : "height";

        // Initialize properties
        this.value = null;
        this.thickness = null;
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     FILL
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    fill(value) {

        // Store value
        this.value = value;

        // Fill tick
        this.self.html(value);
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     STYLE
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    style(dz, dZ) {

        // Style it
        this.self.css(this.property, (dz / dZ * 100) + "%");
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     FORMAT
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    format(f) {

        // Get time value, format and then replace it
        this.fill(lib.convertTime(this.value, f));
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     MEASURE
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    measure() {

        // Initialize first and last border widths
        let first = null,
            last = null;

        // If x-axis
        if (this.type == "x") {

            // Measure thickness
            first = parseFloat(this.self.css("border-left-width"));
            last = parseFloat(this.self.css("border-right-width"));
        }
        // If y-axis
        else if (this.type == "y") {

            // Measure thickness
            first = parseFloat(this.self.css("border-top-width"));
            last = parseFloat(this.self.css("border-bottom-width"));
        }

        // Assign thickness
        this.thickness = Math.max(first, last);
    }

}