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
import {Axis} from "../../modules/graph/axis";
import {GraphBG, GraphI} from "../../modules/graph/graph";

// Enable jQuery
window.$ = window.jQuery = jQuery;

$(document).ready(() => {

    // CONFIG
    const now = new Date();
    const x0 = now.getTime();
    let dx = 1; // Time step (h)
    let dX = 12; // Time range (h)
    const x = [];
    const y0 = 0; // Basal baseline (U/h)
    const yBG = [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15]; // mmol/L
    const yI = [-4, -2, 0, 2, 4]; // U/h
    const BGScale = [3.8, 4.2, 7.0, 12.0]; // (mmol/L)

    // Convert times to ms standard
    dx *= 60 * 60 * 1000;
    dX *= 60 * 60 * 1000;

    // Generate dash
    const dash = new Dash([1, 2, 3, 4]);

    // Generate BG graph
    const graphBG = new GraphBG("BG");

    // Generate I graph
    const graphI = new GraphI("I");

    // Generate axes
    graphI.xAxis = new Axis("x");
    graphI.xAxis.generate(x0, dx, dX)
    graphI.xAxis.build("HH:MM", 1);

    // Append axes
    graphI.self.append(graphI.xAxis.self);

    graphI.buildAxis(yI, null, null, null, "y");
    graphBG.buildAxis(yBG, null, null, null, "y");

    // Share x-axis between I and BG graphs
    graphBG.x = graphI.x;
    graphBG.dX = graphI.dX;
    graphBG.xMin = graphI.xMin;
    graphBG.xMax = graphI.xMax;

    // Get data
    let BGs = lib.getData("reports/BG.json", false, "YYYY.MM.DD - HH:MM:SS"),
        TBs = lib.getData("reports/treatments.json", "Net Basals", "YYYY.MM.DD - HH:MM:SS"),
        Bs = lib.getData("reports/treatments.json", "Boluses", "YYYY.MM.DD - HH:MM:SS");

    // Build BG dots
    graphBG.buildDots("BG", BGs);

    // Show BG dots
    graphBG.showDots("BG", "mmol/L", 1, false);

    // Color BG dots
    graphBG.colorBGs(BGScale);

    // Build bolus dots
    graphI.buildDots("B", Bs);

    // Show bolus dots
    graphI.showDots("B", "U", 1, y0);

    // Build TB bars
    graphI.buildTBs(TBs);

    // Show TB bars
    graphI.showBars("TB", "U/h", 0, y0);

    // TEST
    let axis = new Axis("x");
    axis.build(x0, dx, dX);
    console.log(axis.self);

});