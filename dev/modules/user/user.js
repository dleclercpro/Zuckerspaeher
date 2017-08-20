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
    constructor(now) {

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

        // Store current epoch time
        this.now = now;
	}

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     COMPUTEBATTERYLEVEL
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    computeBatteryLevel(data) {

        // Destructure data
        const [ t, y ] = data;

        // Get last level
        let level = lib.last(y);

        // Define min/max levels (V)
        const maxLevel = 1.50,
              minLevel = 1.15;

        // Convert and round level (%)
        level = lib.round((level - minLevel) / (maxLevel - minLevel) * 100);

        // Return it
        return level
    }

}