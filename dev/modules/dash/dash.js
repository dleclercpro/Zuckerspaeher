/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

 Title:    dash.js

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
import * as config from "../../assets/js/config";

export class Dash {

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     CONSTRUCTOR
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    constructor(now) {

        // Get object from DOM
        this.self = $(".mod-dash");

        // Get its sub-elements
        // Live
        this.live = this.self.find(".live").add($(".mod-user > .details > .live"));
        this.BG = this.live.find(".BG");
        this.trend = this.live.find(".trend");

        // Delta
        this.delta = this.self.find(".delta");
        this.dBG = this.delta.find(".dBG");
        this.dBGdt = this.delta.find(".dBGdt");

        // Insulin
        this.insulin = this.self.find(".insulin");
        this.netBasal = this.insulin.find(".net-basal");
        this.basal = this.insulin.find(".basal");
        this.reservoir = this.insulin.find(".reservoir");

        // On-board
        this.onBoard = this.self.find(".on-board");
        this.IOB = this.onBoard.find(".IOB");
        this.COB = this.onBoard.find(".COB");

        // Factors
        this.factors = this.self.find(".factors");
        this.ISF = this.factors.find(".ISF");
        this.CSF = this.factors.find(".CSF");

        // Age
        this.age = this.self.find(".age");
        this.SAGE = this.age.find(".SAGE");
        this.CAGE = this.age.find(".CAGE");

        // Store current epoch time
        this.now = now;
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     COMPUTEDELTABG
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    computeDeltaBG(data) {

        // Destructure data
        const [ t, y ] = data;

        // Compute dBG (mmol/L)
        const dBG = lib.last(y) - lib.last(y, 2);

        // Return it
        return dBG;
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     COMPUTEDELTABGDELTAT
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    computeDeltaBGDeltaT(data) {

        // Destructure data
        const [ t, y ] = data;

        // Compute dBG (mmol/L)
        const dBG = this.computeDeltaBG(data);

        // Compute dt (h)
        const dt = (lib.last(t) - lib.last(t, 2)) / 1000 / 60 / 60;

        // Compute derivative (mmol/L/h)
        const dBGdt = dBG / dt;

        // Return it
        return dBGdt;
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     COMPUTEBGTREND
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    computeBGTrend(data) {

        // Destructure data
        const [ t, y ] = data;

        // Compute derivative (mmol/L/h)
        const dBGdt = this.computeDeltaBGDeltaT(data);

        // Color trend according to last BG
        this.trend.addClass(lib.rank(lib.last(y), config.BGScale));

        // Return trend
        return lib.rank(dBGdt, config.dBGdtScale);
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     COMPUTESENSORAGE
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    computeSensorAge(data) {

        // Destructure data
        const [ t, y ] = data;

        // Initialize last sensor starting time
        let start;

        // Look for last started in descending order
        for (let i = t.length - 1; i >= 0; i--) {

            // If sensor start found
            if (y[i] == "Started") {

                // Store it
                start = t[i];

                // Exit
                break;
            }
        }

        // Get current epoch time
        const now = new Date().getTime();

        // Compute sensor age (h)
        const age = (now - start) / 1000 / 60 / 60;

        // Return it
        return age;
    }

}