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
import {Dash} from "../../modules/dash/dash";
import {Graph} from "../../modules/graph/graph";

// Enable jQuery
window.$ = window.jQuery = jQuery;

$(document).ready(() => {

    function GraphBG (name) {

        // Extend object
        Graph.apply(this, [name]);

        /**
         * colorBGs
         * @param BGScale
         */
        this.colorBGs = function (BGScale) {

            // Get graph section in which are the BGs
            var graph = this.self.find(".graph");

            // Get BGs
            var BGs = graph.find(".BG");

            // Color BGs
            for (i = 0; i < BGs.length; i++) {
                BG = parseFloat(BGs.eq(i).attr("y"));
                BGs.eq(i).addClass(lib.rankBG(BG, BGScale));
            }
        }
    }

    function GraphI (name) {

        // Extend object
        Graph.apply(this, [name]);

        /**
         * profileTBs
         * @param data
         * @param dt
         * @returns {[*,*]}
         */
        this.profileTBs = function (data, dt = 5 * 60 * 1000) {

            // Store data in separate arrays
            var t = [];
            var net = [];

            // Decouple data
            for (i = 0; i < data[0].length; i++) {
                t[i] = data[0][i];
                net[i] = data[1][i];
            }

            // Sort TB times in case they aren't already
            var x = lib.indexSort(t, [net]);
            t = x[0];
            net = x[1][0];

            // Give user TB profile
            return [t, net];
        };

        /**
         * buildTBs
         * @param data
         */
        this.buildTBs = function (data) {

            // Compute TB profile
            var TBProfile = this.profileTBs(data);

            // Build TBs
            this.buildBars("TB", TBProfile);
        }
    }

    // MAIN
    // Config
    var now = new Date();
    var x = [];
    var x0 = now.getTime();
    var dx = 1 * 60 * 60 * 1000; // Time step (h)
    var dX = 12 * 60 * 60 * 1000; // Time range (h)
    var y0 = 0; // Basal baseline (U/h)
    var yBG = [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15]; // mmol/L
    var dYBG = Math.max(...yBG) - Math.min(...yBG);
    var yI = [-4, -2, 0, 2, 4]; // U/h
    var dYI = Math.max(...yI) - Math.min(...yI);
    var BGScale = [3.8, 4.2, 7.0, 12.0]; // (mmol/L)
    var dBGdtScale = [-0.15 * 60, -0.075 * 60, 0.075 * 60, 0.15 * 60]; // (mmol/L/h)

    // Resizing
    if ($(window).outerWidth() < 800) {
        x0 = now.getTime() - 6 * 60 * 60 * 1000;
        dX = 6 * 60 * 60 * 1000; // Time range (h)
    }

    // Create graph objects
    var graphBG = new GraphBG("BG");
    var graphI = new GraphI("I");

    // Build x-axis for time
    graphI.buildAxis(x, x0, dx, dX, "x", "HH:MM");

    // Share x-axis between I and BG graphs
    graphBG.x = graphI.x;
    graphBG.dX = graphI.dX;
    graphBG.xMin = graphI.xMin;
    graphBG.xMax = graphI.xMax;

    // Build y-axis for I
    graphI.buildAxis(yI, null, null, null, "y", false);

    // Build y-axis for BG
    graphBG.buildAxis(yBG, null, null, null, "y", false);

    // Get BGs
    var BGs = lib.getData("reports/BG.json", false,
        "YYYY.MM.DD - HH:MM:SS");

    // Build BG dots
    graphBG.buildDots("BG", BGs);

    // Show BG dots
    graphBG.showDots("BG", "mmol/L", 1, false);

    // Color BG dots
    graphBG.colorBGs(BGScale);

    // Get Bs
    var Bs = lib.getData("reports/treatments.json", "Boluses",
        "YYYY.MM.DD - HH:MM:SS");

    // Build B dots
    graphI.buildDots("B", Bs);

    // Show B dots
    graphI.showDots("B", "U", 1, y0);

    // Get TBs
    var TBs = lib.getData("reports/treatments.json", "Net Basals",
        "YYYY.MM.DD - HH:MM:SS");

    // Build TB bars
    graphI.buildTBs(TBs);

    // Show TB bars
    graphI.showBars("TB", "U/h", 0, y0);

    // Create dash object
    var dash = new Dash(dBGdtScale);

    // Add dash to page
    dash.get();
    dash.update();


    // Elements
    var user = $("#user");
    var dash = $("#dash");
    var settings = $("#settings");
    var settingsButton = $("#settings-button");



    // Main
    $(window).resize(function () {
        // Show BG dots
        graphBG.showDots("BG", "mmol/L", 1, false, x0 - dX, Math.min(...yBG), dX, dYBG);

        // Show B dots
        graphI.showDots("B", "U", 1, y0, x0 - dX, Math.min(...yI), dX, dYI);

        // Show TB bars
        graphI.showBars("TB", "U/h", 0, y0, x0 - dX, dX, dYI);
    });

    settingsButton.on("click", function () {
        if (settings.css("display") == "none") {
            settings.css("display", "flex");
            settings.hide();
            settings.stop().fadeIn();
        } else {
            settings.stop().fadeOut();
        }
    });

    user.on("click", function () {
        if ($(window).outerWidth() < 640) {
            if (dash.css("display") == "none") {
                dash.css("display", "flex");
                dash.hide();
                dash.stop().fadeIn();
            } else {
                dash.stop().fadeOut();
            }

        }
    });

});