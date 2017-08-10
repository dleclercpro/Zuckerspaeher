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

    // Generate axis for I graph
    _GraphI.buildAxis(x, x0, dx, dX, "x", "HH:MM");




    // Define test element to show stuff
    let _ = $("#graph-I");

    _.append("<p>" + _GraphBG.name + ".</p>");
    _.append("<p>" + _GraphI.name + ".</p>");

});