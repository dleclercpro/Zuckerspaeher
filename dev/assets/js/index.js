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
import {Dash} from "../../modules/dash/dash";
import {GraphBG} from "../../modules/graph/graphBG";
import {GraphI} from "../../modules/graph/graphI";

// Enable jQuery
window.$ = window.jQuery = jQuery;

$(document).ready(() => {

    // CONFIG
    const now = new Date();
    const x0 = now.getTime();
    let dx = 1 * 60 * 60 * 1000; // Time step (ms)
    let dX = 12 * 60 * 60 * 1000; // Time range (ms)
    const x = [];
    const y0 = 0; // Basal baseline (U/h)
    const yBG = [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15]; // mmol/L
    const yI = [-4, -2, 0, 2, 4]; // U/h
    const BGScale = [3.8, 4.2, 7.0, 12.0]; // (mmol/L)

    // Get data
    const BGs = lib.getData("reports/BG.json"),
          TBs = lib.getData("reports/treatments.json", "Net Basals"),
          Bs = lib.getData("reports/treatments.json", "Boluses");

    // Generate dash
    const dash = new Dash([1, 2, 3, 4]);

    // Generate BG graph
    const graphBG = new GraphBG();

    // Generate I graph
    const graphI = new GraphI();

    // Build corner
    graphI.buildCorner();

    // Build axes
    graphI.buildAxis("x", x0, dx, dX, [], "HH:MM", 1);
    graphI.buildAxis("y", null, null, null, yI);
    graphBG.buildAxis("y", null, null, null, yBG);

    // Share axes
    graphI.axes.x.share("x", graphBG);

    // Build inner
    graphI.buildInner();
    graphBG.buildInner();

    // Build BG dots
    graphI.buildBars("TB", "U/h", 2, "YYYY.MM.DD - HH:MM:SS", TBs);
    graphI.buildDots("B", "U", 1, "YYYY.MM.DD - HH:MM:SS", Bs);
    graphBG.buildDots("BG", "mmol/L", 1, "YYYY.MM.DD - HH:MM:SS", BGs);

    // Measure graphs
    graphI.measure();
    graphBG.measure();

    // Add elements
    graphI.addDots("B", y0);
    graphI.addBars("TB");
    graphBG.addDots("BG");

    // Space last bar from current time
    graphI.spaceBars("TB");

    // Color BG dots
    graphBG.color(BGScale);

    // Give infos about graphs
    console.log(graphI);
    console.log(graphBG);

});