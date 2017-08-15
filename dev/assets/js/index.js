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
    const { graphI: graphI, graphBG: graphBG, dash: dash } = elements,
          { TBs: TBs, Bs: Bs, IOBs: IOBs, BGs: BGs} = data;

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
    dash.updateTB(TBs);
    dash.updateIOB(IOBs);
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 SHOW
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
const show = (config, elements) => {

    // Destructure input
    const { graphI: graphI, graphBG: graphBG } = elements;

    // Measure graphs
    graphI.measure();
    graphBG.measure();

    // Add graph elements
    graphI.showDots("B", config.y0);
    graphI.showBars("TB");
    graphBG.showDots("BG");

    // Space graph bars
    graphI.spaceBars("TB");
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 LISTEN
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
const listen = (config, elements) => {

    $(window).on("resize", () => {

        // Reshow
        show(config, elements);
    });
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 MAIN
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
$(document).ready(() => {

    // Config
    const config = {
        x0: new Date().getTime(),
        dx: 1 * 60 * 60 * 1000, // Time step (ms)
        dX: 12 * 60 * 60 * 1000, // Time range (ms)
        y0: 0, // Basal baseline (U/h)
        yBG: [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15], // mmol/L
        yI: lib.mirror([2, 4], true), // U/h
        BGScale: [3.8, 4.2, 7.0, 9.0], // (mmol/L)
        dBGdtScale: lib.mirror([0.1, 0.3]).map(x => lib.round(x * 60 / 5, 1)) // (mmol/L/h)
    };

    // Generate elements
    const elements = {
        graphBG: new GraphBG(),
        graphI: new GraphI(),
        dash: new Dash(config)
    };

    // Get data
    const data = {
        BGs: lib.getData("reports/BG.json"),
        TBs: lib.getData("reports/treatments.json", "Net Basals"),
        Bs: lib.getData("reports/treatments.json", "Boluses"),
        IOBs: lib.getData("reports/treatments.json", "IOB")
    };

    // Build elements
    build(config, elements, data);

    // Show elements
    show(config, elements);

    // Listen to events
    listen(config, elements);

    // Give infos
    console.log(config);
    console.log(elements);
    console.log(data);

});