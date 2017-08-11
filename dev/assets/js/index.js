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
    graphI.yAxis = new Axis("y");
    graphI.yAxis.define(yI);
    graphI.yAxis.build();
    graphBG.yAxis = new Axis("y");
    graphBG.yAxis.define(yBG);
    graphBG.yAxis.build();

    // Build graphs
    graphI.self.append(graphI.corner.self);
    graphI.self.append(graphI.xAxis.self);
    graphI.self.append(graphI.yAxis.self);
    graphI.self.append(graphI.inner.self);

    graphBG.self.append(graphBG.yAxis.self);
    graphBG.self.append(graphBG.inner.self);

    // Share x-axis between I and BG graphs
    graphBG.x = graphI.xAxis.z;
    graphBG.dX = graphI.xAxis.dZ;
    graphBG.xMin = graphI.xAxis.min;
    graphBG.xMax = graphI.xAxis.max;
    graphBG.y = graphBG.yAxis.z;
    graphBG.dY = graphBG.yAxis.dZ;
    graphBG.yMin = graphBG.yAxis.min;
    graphBG.yMax = graphBG.yAxis.max;
    graphI.x = graphI.xAxis.z;
    graphI.dX = graphI.xAxis.dZ;
    graphI.xMin = graphI.xAxis.min;
    graphI.xMax = graphI.xAxis.max;
    graphI.y = graphI.yAxis.z;
    graphI.dY = graphI.yAxis.dZ;
    graphI.yMin = graphI.yAxis.min;
    graphI.yMax = graphI.yAxis.max;

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

});