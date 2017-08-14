/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

 Title:    bar.js

 Author:   David Leclerc

 Version:  0.1

 Date:     14.08.2017

 License:  GNU General Public License, Version 3
 (http://www.gnu.org/licenses/gpl.html)

 Overview: ...

 Notes:    ...

 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

export class Bar {

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     CONSTRUCTOR
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    constructor(type, units, round, format) {

        // Define node
        this.self = $("<div class='bar " + type + "'></div>");

        // Add sub-elements
        this.self.append($("<div class='inner'></div>"))
                 .append($("<div class='inner'></div>"));

        // Store properties
        this.type = type;
        this.units = units;
        this.round = round;
        this.format = format;

        // Initialize properties
        this.x = null;
        this.y = null;
        this.thickness = null;
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     DEFINE
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    define(x, y) {

        // Define coordinates
        this.x = x;
        this.y = y;
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     POSITION
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    position(w, h, y) {

        // Position bar
        this.self.css({
            "width": w,
            "height": Math.abs(h),
            "margin-bottom": y
        });
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     CLASSIFY
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    classify() {

        // Initialize size
        let size = "";

        // If y is bigger than 0
        if (this.y > 0) {

            // Classify
            size = "high";
        }
        // If y is small than 0
        else if (this.y < 0) {

            // Classify
            size = "low";
        }
        // If y is 0
        else {

            // Classify
            size = "zero";
        }

        // Add class
        this.self.addClass(size);
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     MEASURE
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    measure() {

        // Measure possible thicknesses
        let a = this.self.css("border-top-width"),
            b = this.self.css("border-bottom-width");

        // Store real thickness
        this.thickness = Math.max(parseFloat(a), parseFloat(b));
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     INFORM
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    inform(bubble) {

        // When mouse enters dot
        this.self.on("mouseenter", () => {

            // Update bubble
            bubble.update(this);

            // Position it
            bubble.position();

            // Show it
            bubble.self.show();
        });

        // When mouse exits dot
        this.self.on("mouseleave", () => {

            // Hide bubble
            bubble.self.hide();
        });
    }

}