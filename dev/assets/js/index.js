/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

 Title:    index.js

 Author:   David Leclerc

 Version:  0.1

 Date:     24.01.2017

 License:  GNU General Public License, Version 3
           (http://www.gnu.org/licenses/gpl.html)

 Overview: ...

 Notes:    ...

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

// Imports
import jQuery from "jquery";
import * as lib from "./lib";
import * as bubble from "../../modules/bubble/bubble";
import * as dash from "../../modules/dash/dash";
import * as graph from "../../modules/graph/graph";

// Enable jQuery
window.$ = window.jQuery = jQuery;

$(document).ready(() => {

    // CONFIG
    const now = new Date();
    const x = [];
    const x0 = now.getTime();
    let dx = 1; // Time step (h)
    let dX = 12; // Time range (h)
    const yBG = [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15]; // mmol/L
    const yI = [-4, -2, 0, 2, 4]; // U/h
    const BGScale = [3.8, 4.2, 7.0, 12.0]; // (mmol/L)

    // Convert times to ms standard
    dx *= 60 * 60 * 1000;
    dX *= 60 * 60 * 1000;



    // Generate bubble
    //const _Bubble = new bubble.Bubble();
    //_Bubble.update(test, "Test", "09.08.2017", 5.525, "U/h", 2);
    //_Bubble.show();

    // Generate dash
    const _Dash = new dash.Dash([1, 2, 3, 4]);

    // Generate BG graph
    const _GraphBG = new graph.GraphBG("BG");

    // Generate I graph
    const _GraphI = new graph.GraphI("I");

    // Generate axes
    _GraphI.buildAxis(x, x0, dx, dX, "x", "HH:MM");
    _GraphI.buildAxis(yI, null, null, null, "y");
    _GraphBG.buildAxis(yBG, null, null, null, "y");

    // Share x-axis between I and BG graphs
    _GraphBG.x = _GraphI.x;
    _GraphBG.dX = _GraphI.dX;
    _GraphBG.xMin = _GraphI.xMin;
    _GraphBG.xMax = _GraphI.xMax;

    // Get data
    let BGs = lib.getData("reports/BG.json", false, "YYYY.MM.DD - HH:MM:SS"),
        TBs = lib.getData("reports/treatments.json", "Net Basals", "YYYY.MM.DD - HH:MM:SS"),
        Bs = lib.getData("reports/treatments.json", "Boluses", "YYYY.MM.DD - HH:MM:SS");

    // Build BG dots
    _GraphBG.buildDots("BG", BGs);

    // Show BG dots
    _GraphBG.showDots("BG", "mmol/L", 1, false);

    // Color BG dots
    _GraphBG.colorBGs(BGScale);

});