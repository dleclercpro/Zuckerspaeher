/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

 Title:    user.js

 Author:   David Leclerc

 Version:  0.1

 Date:     15.08.2017

 License:  GNU General Public License, Version 3
 (http://www.gnu.org/licenses/gpl.html)

 Overview: ...

 Notes:    ...

 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

 // Imports
import * as lib from "../../assets/js/lib";

export class User {

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     CONSTRUCTOR
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    constructor(config) {

    	// Get object from DOM
        this.self = $(".mod-user");

        // Get its sub-elements
        // Info
        this.name = this.self.find(".name");
        this.birthday = this.self.find(".birthday");

        // CGM
        this.cgm = this.self.find(".cgm");
        this.cgmVendor = this.cgm.find(".vendor");
        this.cgmProduct = this.cgm.find(".product");
        this.cgmBattery = this.cgm.find(".battery");

        // Pump
        this.pump = this.self.find(".pump");
        this.pumpVendor = this.pump.find(".vendor");
        this.pumpProduct = this.pump.find(".product");
        this.pumpBattery = this.pump.find(".battery");

        // Loop
        this.loopTime = this.self.find(".loop > .time");
        this.loopSuccess = this.self.find(".loop > .success");

        // Live
        this.liveBG = this.self.find(".live > .BG");
        this.liveTrend = this.self.find(".live > .trend");

        // Store input
        this.now = config.x0;
	}

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     UPDATEPUMPBATTERYLEVEL
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    updatePumpBatteryLevel(data) {

        // Destructure data
        const [ t, levels ] = data;

        // Get last level and its corresponding epoch time
        const lastT = lib.last(t),
              lastLevel = lib.last(levels);

        // Define max validity time (ms)
        const dtMax = 60 * 60 * 1000;

        // If last level found is still valid
        lib.verifyValidity(lastT, this.now, dtMax, () => {

        	// Define min/max levels (V)
        	const maxLevel = 1.50,
        		  minLevel = 1.15;

		    // Compute and round level (%)
		    const level = lib.round((lastLevel - minLevel) / (maxLevel - minLevel) * 100, 0);

		    // Rank level
		    if (level < 20) {
		    	this.pumpBattery.addClass("very-low");
		    } else if (level >= 20 && level < 50) {
		    	this.pumpBattery.addClass("low");
		    } else if (level >= 50 && level < 75) {
		    	this.pumpBattery.addClass("medium");
		    } else if (level >= 75 && level < 90) {
		    	this.pumpBattery.addClass("high");
		    } else if (level >= 90) {
		    	this.pumpBattery.addClass("very-high");
		    }

            // Update level
            this.pumpBattery.text("(" + level + "%)");

        });
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     UPDATECGMBATTERYLEVEL
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    updateCGMBatteryLevel(data) {

        // Destructure data
        const [ t, levels ] = data;

        // Get last level and its corresponding epoch time
        const lastT = lib.last(t),
              lastLevel = lib.last(levels);

        // Define max validity time (ms)
        const dtMax = 30 * 60 * 1000;

        // If last level found is still valid
        lib.verifyValidity(lastT, this.now, dtMax, () => {

		    // Round level (%)
		    const level = lib.round(lastLevel, 0);

		    // Rank level
		    if (level < 20) {
		    	this.cgmBattery.addClass("very-low");
		    } else if (level >= 20 && level < 50) {
		    	this.cgmBattery.addClass("low");
		    } else if (level >= 50 && level < 75) {
		    	this.cgmBattery.addClass("medium");
		    } else if (level >= 75 && level < 90) {
		    	this.cgmBattery.addClass("high");
		    } else if (level >= 90) {
		    	this.cgmBattery.addClass("very-high");
		    }

            // Update level
            this.cgmBattery.text("(" + level + "%)");

        });
    }

}