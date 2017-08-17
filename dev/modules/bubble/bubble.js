/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

 Title:    bubble.js

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

export class Bubble {

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     CONSTRUCTOR
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    constructor() {

        // Get node
        this.self = $(".mod-bubble");

        // Read properties
        this.info = this.self.find(".info");
        this.time = this.self.find(".time");

        // Initialize properties
        this.target = null;
        this.type = null;
        this.units = null;
        this.round = null;
        this.format = null;
        this.x = null;
        this.y = null;
        this.w = null;
        this.h = null;
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     MEASURE
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    measure() {

        // Read bubble size
        this.w = this.self.outerWidth();
        this.h = this.self.outerHeight();
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     UPDATE
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    update(target) {

        // Store target
        this.target = target;

        // Read properties from target
        this.type = lib.filterString(target.self.attr("class"), "mod-");
        this.units = target.units;
        this.round = target.round;
        this.format = target.format;
        this.x = target.x;
        this.y = target.y;

        // Format time if desired
        if (this.format != null) {

            // Format
            this.x = lib.formatTime(this.x, this.format);
        }

        // Round info if desired
        if (this.round != null) {

            // Round
            this.y = this.y.toFixed(this.round);
        }

        // Update time
        this.time.html(this.x);

        // Generate value and units
        const value = "<span class='value " + this.type + "'>" + this.y + "</span>",
              units = "<span class='units'>" + this.units + "</span>";

        // Update them
        this.info.html(value + " " + units);
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     POSITION
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    position(mouseEvent, windowWidth, windowHeight) {

        // Get current mouse position
        let [x, y] = [mouseEvent.clientX, mouseEvent.clientY];

        // Add offset from mouse
        x += 10;

        // Compute deltas with window extremities
        const dx = x + this.w - windowWidth,
            dy = y + this.h - windowHeight;

        // Bring back bubble within window range
        // x-axis
        if (dx > 0) {

            // Bring back
            x -= dx;
        }
        // y-axis
        else if (dy > 0) {

            // Bring back
            y -= dy;
        }

        // Position bubble
        this.self.css({
            "left": x,
            "top": y
        });
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     SHOW
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    show() {

        // Read window size
        const w = $(window).outerWidth(),
              h = $(window).outerHeight();

        // Start listening to mouse move within target
        this.target.self.on("mousemove", (e) => {

            // Position bubble
            this.position(e, w, h);
        });

        // Show bubble
        this.self.show();
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     HIDE
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    hide() {

        // Stop listening to mouse move within target
        this.target.self.off("mousemove");

        // Hide bubble
        this.self.hide();
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     LISTEN
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    listen(target) {

        // When mouse enters target
        target.self.on("mouseenter", () => {

            // Update bubble using target
            this.update(target);

            // Measure it
            this.measure();

            // Show it
            this.show();
        });

        // When mouse exits target
        target.self.on("mouseleave", () => {

            // Hide bubble
            this.hide();
        });
    }
}