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
import {Graph} from "../../modules/graph/graph";

// Enable jQuery
window.$ = window.jQuery = jQuery;

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 BUILD
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
const build = (elements, data, now) => {

    // Destructure input
    const { graphI,
            graphBG,
            dash,
            user } = elements,
          { NBs,
            Bs,
            IOBs,
            ISF,
            CSF,
            BGs,
            basal,
            pumpReservoirLevels,
            pumpBatteryLevels,
            cgmBatteryLevels} = data;

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
    graphI.buildBars("TB", "U/h", 2, "YYYY.MM.DD - HH:MM:SS", NBs);
    graphI.buildDots("B", "U", 1, "YYYY.MM.DD - HH:MM:SS", Bs);
    graphI.buildDots("IOB", "U", 1, "YYYY.MM.DD - HH:MM:SS", IOBs);
    graphBG.buildDots("BG", "mmol/L", 1, "YYYY.MM.DD - HH:MM:SS", BGs);

    // Rank graph elements
    graphBG.rank("dots", "BG", config.BGScale);

    // Update dash
    dash.updateBG(BGs);
    dash.updateNB(NBs);
    dash.updateIOB(IOBs);
    dash.updatePumpReservoirLevel(pumpReservoirLevels, config.reservoirLevelScale);
    dash.updateBasal(basal);
    dash.updateISF(ISF);
    dash.updateCSF(CSF);

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
    graphI.showBars("TB");
    graphI.showDots("B", config.y0);
    graphI.showDots("IOB");
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
        graphBG: new Graph("BG"),
        graphI: new Graph("I"),
        dash: new Dash(now),
        user: new User(now),
    };

    // Get data
    const data = {
        BGs: lib.getData("reports/BG.json"),
        Bs: lib.getData("reports/treatments.json", ["Boluses"]),
        basal: lib.getData("reports/pump.json", ["Basal Profile (Standard)"], "HH:MM"),
        NBs: lib.getData("reports/treatments.json", ["Net Basals"]),
        IOBs: lib.getData("reports/treatments.json", ["IOB"]),
        ISF: lib.getData("reports/pump.json", ["ISF"]),
        CSF: lib.getData("reports/pump.json", ["CSF"]),
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