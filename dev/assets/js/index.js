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
import {User} from "../../modules/user/user";
import {Dash} from "../../modules/dash/dash";
import {GraphBG} from "../../modules/graph/graphBG";
import {GraphI} from "../../modules/graph/graphI";

// Enable jQuery
window.$ = window.jQuery = jQuery;

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 BUILD
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
const build = (config, elements, data) => {

    // Destructure input
    const { graphI: graphI,
            graphBG: graphBG,
            dash: dash,
            user: user } = elements,
          { TBs: TBs,
            Bs: Bs,
            IOBs: IOBs,
            BGs: BGs,
            pumpReservoirLevels: pumpReservoirLevels,
            pumpBatteryLevels: pumpBatteryLevels,
            cgmBatteryLevels: cgmBatteryLevels} = data;

    // Build corner
    graphI.buildCorner();

    // Build axes
    graphI.buildAxis("x", config.x0, config.dx, config.dX, [], "HH:MM", 1);
    graphI.buildAxis("y", null, null, null, config.yI);
    graphBG.buildAxis("y", null, null, null, config.yBG);

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
const show = (config, elements) => {

    // Destructure input
    const { graphI: graphI,
            graphBG: graphBG } = elements;

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
const listen = (mq, config, elements) => {

    $(window).on("resize", () => {

        // Reshow
        show(config, elements);
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

    // Media queries
    const mq = {
        tablet: window.matchMedia("(min-width: 640px)"),
        desktop: window.matchMedia("(min-width: 1024px)"),
    };

    // Config
    const config = {
        x0: new Date().getTime(),
        dx: 1 * 60 * 60 * 1000, // Time step (ms)
        dX: 12 * 60 * 60 * 1000, // Time range (ms)
        y0: 0, // Basal baseline (U/h)
        yBG: [0, 2, 4, 6, 8, 10, 15, 20], // mmol/L
        yI: lib.mirror([2, 4], true), // U/h
        BGScale: {
            ranks: ["very-low", "low", "normal", "high", "very-high"],
            limits: [3.8, 4.2, 7.0, 9.0], // (mmol/L)
        },
        dBGdtScale: {
            ranks: ["↓↓", "↓", "↘", "→", "↗", "↑", "↑↑"],
            limits: lib.mirror([0.1, 0.3, 0.5]).map(x => lib.round(x * 60 / 5, 1)), // (mmol/L/h)
        },
        batteryLevelScale: {
            ranks: ["very-low", "low", "medium", "high", "very-high"],
            limits: [20, 50, 75, 90], // (%)
        },
        reservoirLevelScale: {
            ranks: ["very-low", "low", "medium", "high", "very-high"],
            limits: [25, 50, 100, 200], // (U)
        },
    };

    // Generate elements
    const elements = {
        graphBG: new GraphBG(),
        graphI: new GraphI(),
        dash: new Dash(config),
        user: new User(config),
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
    build(config, elements, data);

    // Show elements
    show(config, elements);

    // Listen to events
    listen(mq, config, elements);

    // Give infos
    console.log(config);
    console.log(elements);
    console.log(data);

});