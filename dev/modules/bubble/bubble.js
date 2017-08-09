// Imports
import * as lib from "../../assets/js/lib";

export class Bubble {

    /**
     * CONSTRUCTOR
     */
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

    /**
     * UPDATE
     * @param target
     * @param type
     * @param x
     * @param y
     * @param units
     * @param round
     * @param format
     */
    update(target, type, x, y, units, round, format) {

        // Define properties
        this.target = target;
        this.type = type;
        this.x = x;
        this.y = y;
        this.units = units;
        this.round = round;
        this.format = format;

        // Convert time if desired
        if (format) {
            x = lib.convertTime(x, format);
        }

        // Round info if desired
        if (round) {
            y = lib.round(y, round);
        }

        // Update infos in bubble
        this.time.html(x);
        this.info.html("<span class='" + type + "'>" + y + "</span> " + units);
    }

    /**
     * SHOW
     */
    show() {

        // Position bubble
        this.self.css({
            "top": 0,
            "left": 0,
        });

        // Show bubble
        this.self.show();
    }

    /**
     * HIDE
     */
    hide() {

        // Hide bubble
        this.self.hide();
    }
}