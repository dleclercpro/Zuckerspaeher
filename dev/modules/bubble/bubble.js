// Imports
import * as lib from "../../assets/js/lib";

export class Bubble {

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     CONSTRUCTOR
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    constructor() {

        // Get node
        this.self = $("#bubble");

        // Read properties
        this.info = this.self.find("#bubble-info");
        this.time = this.self.find("#bubble-time");

        // Initialize properties
        this.target = null;
        this.type = null;
        this.units = null;
        this.round = null;
        this.format = null;
        this.x = null;
        this.y = null;
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     UPDATE
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    update(target) {

        // Store target properties
        this.target = target;

        // Read properties from target
        this.type = target.self.attr("class");
        this.units = target.units;
        this.round = target.round;
        this.format = target.format;
        this.x = target.x;
        this.y = target.y;

        // Convert time if desired
        if (this.format != null) {
            this.x = lib.convertTime(this.x, this.format);
        }

        // Round info if desired
        if (this.round != null) {
            this.y = lib.round(this.y, this.round);
        }

        // Update infos in bubble
        this.time.html(this.x);
        this.info.html("<span class='" + this.type + "'>" + this.y + "</span> " + this.units);
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     POSITION
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    position(offsetX = 8, offsetY = 0) {

        // Read bubble size
        const w = this.self.outerWidth();
        const h = this.self.outerHeight();

        // Define bubble coordinates
        const offsetTop = parseFloat(this.target.self.parent().position().top);

        // Compute bubble position
        let x = parseFloat(this.target.self.position().left) +
                parseFloat(this.target.self.css("width")) + offsetX;
        let y = parseFloat(this.target.self.position().top) + offsetY + offsetTop;

        // Adjust position of bubble due to it being in content element
        if (offsetTop) {

            // Reposition it
            y += h;
        }

        // If bubble exceeds width of graph
        if (x + w > this.target.self.parent().outerWidth()) {

            // Reposition it
            x -= 3 * offsetX + w;
        }

        // If bubble exceeds height of graph
        if (y + h > this.target.self.parent().outerHeight()) {

            // Reposition it
            y -= 3 * offsetY + h;
        }

        // Position bubble on graph
        this.self.css({
            "left": x,
            "top": y
        });
    }

}