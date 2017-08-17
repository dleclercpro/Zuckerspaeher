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

export class Dash {

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     CONSTRUCTOR
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    constructor(config) {

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

        // Store input
        this.now = config.x0;
        this.BGScale = config.BGScale;
        this.dBGdtScale = config.dBGdtScale;
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     UPDATEBG
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    updateBG(data) {

        // Destructure data
        const [ t, BGs ] = data;

        // Get last BGs and their corresponding epoch times
        const lastT = lib.last(t),
              lastBG = lib.last(BGs),
              lastlastT = lib.last(t, 2),
              lastlastBG = lib.last(BGs, 2);

        // Define max validity time (ms) for (1) latest BG and (2) latest dBG/dt
        const dtMaxBG = 15 * 60 * 1000,
              dtMaxdBGdt = 5 * 60 * 1000;

        // If last BG found is still valid
        lib.verifyValidity(lastT, this.now, dtMaxBG, () => {

            // Compute BG rank
            const BGRank = lib.rank(lastBG, this.BGScale);

            // Update BG
            this.BG.text(lib.round(lastBG, 1));

            // Add rank
            this.BG.addClass(BGRank);

            // If second last BG found is still valid
            lib.verifyValidity(lastlastT, lastT, dtMaxdBGdt, () => {

                // Compute dBG (mmol/L)
                const dBG = lastBG - lastlastBG;

                // Compute dt (h)
                const dt = (lastT - lastlastT) / 1000 / 60 / 60;

                // Compute derivative (mmol/L/ms)
                const dBGdt = dBG / dt;

                // Compute dBG/dt rank and get trend arrow
                const trend = lib.rank(dBGdt, this.dBGdtScale);

                // Update dBG and dBG/dt
                this.dBG.find(".value").text(lib.round(dBG, 1));
                this.dBGdt.find(".value").text(lib.round(dBGdt, 1));

                // Add trend arrow
                this.trend.text(trend).addClass(BGRank);
            });
        });
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     UPDATENB
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    updateNB(data) {

        // Destructure data
        const [ t, TBs ] = data;

        // Get last TB and its corresponding epoch time
        const lastT = lib.last(t),
              lastTB = lib.last(TBs);

        // Define max validity time (ms)
        const dtMax = 30 * 60 * 1000;

        // If last TB found is still valid
        lib.verifyValidity(lastT, this.now, dtMax, () => {

            // Update TB
            this.netBasal.find(".value").text(lib.round(lastTB, 2));

        });
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     UPDATEIOB
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    updateIOB(data) {

        // Destructure data
        const [ t, IOBs ] = data;

        // Get last IOB and its corresponding epoch time
        const lastT = lib.last(t),
              lastIOB = lib.last(IOBs);

        // Define max validity time (ms)
        const dtMax = 15 * 60 * 1000;

        // If last TB found is still valid
        lib.verifyValidity(lastT, this.now, dtMax, () => {

            // Update TB
            this.IOB.find(".value").text(lib.round(lastIOB, 1));
        });
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     UPDATEPUMPRESERVOIRLEVEL
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    updatePumpReservoirLevel(data, scale) {

        // Destructure data
        const [ t, levels ] = data;

        // Get last level and its corresponding epoch time
        const lastT = lib.last(t),
              lastLevel = lib.last(levels);

        // Define max validity time (ms)
        const dtMax = 30 * 60 * 1000;

        // If last level found is still valid
        lib.verifyValidity(lastT, this.now, dtMax, () => {

            // Round level (U)
            const level = lib.round(lastLevel, 1);

            // Rank level
            this.reservoir.addClass(lib.rank(level, scale));

            // Update level
            this.reservoir.find(".value").text(level);

        });
    }

}