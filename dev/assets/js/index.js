/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

 Title:    index.js

 Author:   David Leclerc

 Version:  0.1

 Date:     24.01.2017

 License:  GNU General Public License, Version 3
           (http://www.gnu.org/licenses/gpl.html)

 Overview: ...

 Notes:    ...

 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

// Imports
import jQuery from "jquery";
import * as lib from "./lib";
import * as config from "./config";
import {User} from "../../modules/user/user";
import {Dash} from "../../modules/dash/dash";
import {GraphBG} from "../../modules/graph/graphBG";
import {GraphI} from "../../modules/graph/graphI";

// Enable jQuery
window.$ = window.jQuery = jQuery;

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 BUILD
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
const build = (elements, data, now) => {

    // Destructure input
    const { graphI, graphBG, dash, user } = elements,
          { TBs, Bs, IOBs, BGs, pumpReservoirLevels, pumpBatteryLevels, cgmBatteryLevels} = data;

    // Build corner
    graphI.buildCorner();

    // Build axes
    graphI.buildAxis("x", null, now, config.dx, config.dX, "HH:MM", 1);
    graphI.buildAxis("y", config.yI);
    graphBG.buildAxis("y", config.yBG);

    // Share axes
    graphI.axes.x.share("x", graphBG);

    // Build inner
    graphI.buildInner();
    graphBG.buildInner();

    // Build graph elements
    graphI.buildBars("TB", "U/h", 2, "YYYY.MM.DD - HH:MM:SS", TBs);
    graphI.buildDots("B", "U", 1, "YYYY.MM.DD - HH:MM:SS", Bs);
    graphBG.buildDots("BG", "mmol/L", 1, "YYYY.MM.DD - HH:MM:SS", BGs);

    // Color graph elements
    graphBG.color(config.BGScale);

    // Update dash
    dash.updateBG(BGs);
    dash.updateNB(TBs);
    dash.updateIOB(IOBs);
    dash.updatePumpReservoirLevel(pumpReservoirLevels, config.reservoirLevelScale);

    // Update user
    user.updatePumpBatteryLevel(pumpBatteryLevels, config.batteryLevelScale);
    user.updateCGMBatteryLevel(cgmBatteryLevels, config.batteryLevelScale);
};

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 SHOW
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
const show = (elements) => {

    // Destructure input
    const { graphI, graphBG } = elements;

    // Measure graphs
    graphI.measure();
    graphBG.measure();

    // Add graph elements
    graphI.showDots("B", config.y0);
    graphI.showBars("TB");
    graphBG.showDots("BG");

    // Space graph bars
    graphI.spaceBars("TB");
};

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 LISTEN
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
const listen = (mq, elements) => {

    $(window).on("resize", () => {

        // Reshow
        show(elements);
    });


    // Desktop breakpoint
    mq.desktop.addListener(() => {
        
        // Tablet -> Desktop
        if (mq.desktop.matches) {

        }

        // Desktop -> Tablet
        else if (mq.tablet.matches) {

        }
    });

    // Tablet breakpoint
    mq.tablet.addListener(() => {

        // Mobile -> Tablet
        if (mq.tablet.matches) {

        }

        // Tablet -> Mobile
        else {

        }
    });
};

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 MAIN
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
$(document).ready(() => {

    // Define current epoch time
    const now = new Date().getTime();

    // Media queries
    const mq = {
        tablet: window.matchMedia("(min-width: 640px)"),
        desktop: window.matchMedia("(min-width: 1024px)"),
    };

    // Generate elements
    const elements = {
        graphBG: new GraphBG(),
        graphI: new GraphI(),
        dash: new Dash(now),
        user: new User(now),
    };

    // Get data
    const data = {
        BGs: lib.getData("reports/BG.json"),
        TBs: lib.getData("reports/treatments.json", ["Net Basals"]),
        Bs: lib.getData("reports/treatments.json", ["Boluses"]),
        IOBs: lib.getData("reports/treatments.json", ["IOB"]),
        pumpReservoirLevels: lib.getData("reports/history.json", ["Pump", "Reservoir Levels"]),
        pumpBatteryLevels: lib.getData("reports/history.json", ["Pump", "Battery Levels"]),
        cgmBatteryLevels: lib.getData("reports/history.json", ["CGM", "Battery Levels"]),
    };

    // Build elements
    build(elements, data, now);

    // Show elements
    show(elements);

    // Listen to events
    listen(mq, elements);

    // Give infos
    console.log(config);
    console.log(elements);
    console.log(data);

});