// Imports
import * as lib from "../../assets/js/lib";

export class Bubble {

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     CONSTRUCTOR
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    constructor() {

        // Get object from DOM
        this.self = $("#bubble");
        this.info = this.self.find("#bubble-info");
        this.time = this.self.find("#bubble-time");

        // Initialize properties
        this.target = null;
        this.units = null;
        this.round = null;
        this.format = null;
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     UPDATE
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    update(target, type, units, round, format) {

        // Define properties
        this.target = $(target);
        this.type = type;
        this.units = units;
        this.round = round;
        this.format = format;

        // Read properties from target
        this.x = this.target.attr("x");
        this.y = this.target.attr("y");

        // Convert time if desired
        if (format) {
            this.x = lib.convertTime(this.x, format);
        }

        // Round info if desired
        if (round) {
            this.y = lib.round(this.y, round);
        }

        // Update infos in bubble
        this.time.html(this.x);
        this.info.html("<span class='" + type + "'>" + this.y + "</span> " + units);
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     SHOW
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    show(offsetX = 8, offsetY = 0) {

        // Define bubble coordinates
        const offsetTop = parseFloat(this.target.parent().position().top);

        // Compute bubble position
        let x = parseFloat(this.target.position().left) +
                  parseFloat(this.target.css("width")) + offsetX;
        let y = parseFloat(this.target.position().top) + offsetY + offsetTop;

        // Read bubble size
        let w = this.self.outerWidth();
        let h = this.self.outerHeight();

        // Adjust position of bubble due to it being in content element
        if (offsetTop) {
            y += h; // FIXME
        }

        // Position bubble on graph
        this.self.css({
            "left": x,
            "top": y
        });

        // If bubble exceeds width of graph
        if (x + w > this.target.parent().outerWidth()) {
            this.self.css({
                "left": x - 3 * offsetX - w
            });
        }

        // If bubble exceeds height of graph
        if (y + h > this.target.parent().outerHeight()) {
            this.self.css({
                "top": y - 3 * offsetY - h
            });
        }

        // Show bubble
        this.self.show();
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     HIDE
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    hide() {

        // Hide bubble
        this.self.hide();
    }
}