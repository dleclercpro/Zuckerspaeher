/*==============================================================================

    Title:    index.js

    Author:   David Leclerc

    Version:  0.1

    Date:     24.01.2017

    License:  GNU General Public License, Version 3
              (http://www.gnu.org/licenses/gpl.html)

    Overview: ...

    Notes:    ...

==============================================================================*/

$(document).ready(function() {

    // OBJECTS

    function Graph(name) {

        /*======================================================================
            GENERATEAXIS
        ======================================================================*/
        this.generateAxis = function(z0, dz, dZ) {
            // Initialize empty array
            var z = [];

            // Generate axis tick
            for (i = 0; i < (dZ / dz); i++) {
                z.unshift(z0 - i * dz);
            }

            // Add last tick based on given dZ
            z.unshift(z0 - dZ);

            return z;
        }

        /*======================================================================
            BUILDAXIS
        ======================================================================*/
        this.buildAxis = function(z, z0, dz, dZ, label, format) {
            // Create axis node
            var axis = $("<div class='graph-" + label + "-axis'></div>");

            // Build axis based on z0, dz and dZ
            if (z.length == 0) {
                z = this.generateAxis(z0, dz, dZ);

                for (i = 0; i < z.length - 1; i++) {
                    dz = z[i + 1] - z[i];

                    axis.append($("<div class='graph-" +
                        label +"-axis-tick'>" + z[i + 1] + "</div>")
                            .css({
                                "width": (dz / dZ * 100) + "%"
                            })
                    );
                }
            }

            // Build axis based on provided z array
            else {
                dZ = z.max() - z.min();

                for (i = 0; i < z.length - 1; i++) {
                    dz = z[i + 1] - z[i];

                    axis.append($("<div class='graph-" +
                        label + "-axis-tick'>" + z[i] + "</div>")
                            .css({
                                "height": (dz / dZ * 100) + "%"
                            })
                    );
                }
            }

            // Format axis ticks if desired
            if (format) {
                axis.children().each(function() {
                    $(this).html(convertTime($(this).html(), format));
                });
            }

            // If x-axis, add dead corner
            if (label == "x") {
                this.buildCorner();
            }

            // Append axis to graph
            this.e.append(axis);
        }

        /*======================================================================
            BUILDCORNER
        ======================================================================*/
        this.buildCorner = function() {
            this.e.append($("<div class='graph-NA'></div>"));
        }

        /*======================================================================
            BUILDDOTS
        ======================================================================*/
        this.buildDots = function(type, data) {
            // If inside section of graph does not already exist, create it
            var exists = true;
            var graph = this.e.find(".graph");

            if (!graph.length) {
                exists = false;
                graph = ($("<div class='graph'></div>"));

                // Append section to graph
                this.e.append(graph);
            }

            // Store data in separate arrays
            var x = data[0];
            var y = data[1];

            // Initialize array for dot elements
            var dots = [];

            // Build dot elements
            for (i = 0; i < x.length; i++) {
                dots.push($("<div class='" + type + "' x='" + x[i] +
                    "' y='" + y[i] + "'></div>"));

                // Add first and last classes
                if (i == 0) {
                    dots[i].addClass("first-" + type);
                } else if (i == x.length - 1) {
                    dots[i].addClass("last-" + type);
                }
            }

            // Append dots to inside section of graph
            graph.append(dots);
        }

        /*======================================================================
            BUILDBARS
        ======================================================================*/
        this.buildBars = function(type, data) {
            // If section of graph does not already exist, create it
            var exists = true;
            var graph = this.e.find(".graph");

            if (!graph.length) {
                exists = false;
                graph = ($("<div id='graph'></div>"));

                // Append section to graph
                this.e.append(graph);
            }

            // Store data in separate arrays
            var x = data[0];
            var y = data[1];

            // Initialize array for bar elements
            var bars = [];

            // Build bar elements
            for (i = 0; i < x.length; i++) {
                bars[i] = $("<div class='" + type + 
                    "' x='" + x[i] + "' y='" + y[i] + "'></div>");

                // Add subelements inside bar
                for (j = 0; j < 2; j++) {
                    bars[i].append($("<div class='inner-" + type + "'></div>"));
                }

                // Add first and last classes
                if (i == 0) {
                    bars[i].addClass("first-" + type);
                } else if (i == x.length - 1) {
                    bars[i].addClass("last-" + type);
                }
            }

            // Append bars to inside section of graph
            graph.append(bars);
        }

        /*======================================================================
            SHOWDOTS
        ======================================================================*/
        this.showDots = function(type, units, round, y0, xMin, yMin, dX, dY) {
            // Get graph section in which dots must displayed
            var graph = this.e.find(".graph");

            // Get axis ticks
            var xTicks = $(".graph-x-axis-tick");
            var yTicks = $(".graph-y-axis-tick");

            // Get dots
            var dots = graph.find("." + type);

            // Get dot styles
            var radiusDot = parseFloat(dots.first().outerWidth()) / 2;
            var thicknessXTick = parseFloat(
                xTicks.first().css("border-left-width") ||
                xTicks.first().css("border-right-width"));
            var thicknessYTick = parseFloat(
                yTicks.first().css("border-top-width") ||
                yTicks.first().css("border-bottom-width")); // FIXME

            // Extract information from dots
            var X = [];
            var Y = [];

            for (i = 0; i < dots.length; i++) {
                X[i] = parseFloat(dots.eq(i).attr("x"));
                Y[i] = parseFloat(dots.eq(i).attr("y"));
            }

            // Compute coordinates of dots
            var x = [];
            var y = [];
            var dx;
            var dy;

            for (i = 0; i < dots.length; i++) {
                dx = X[i] - xMin;
                dy = y0 ? y0 : Y[i] - yMin;

                x[i] = dx / dX * graph.outerWidth()
                    - radiusDot
                    - thicknessXTick / 2;
                y[i] = dy / dY * graph.outerHeight()
                    - radiusDot
                    + thicknessYTick / 2;
            }

            // Position dots on graph
            for (i = 0; i < dots.length; i++) {
                dots.eq(i).css({
                    "left": x[i] + "px",
                    "bottom": y[i] + "px"
                });
            }

            // Show bubble
            var bubble = this.bubble;

            for (i = 0; i < dots.length; i++) {
                dots.eq(i).on("mouseenter", function () {
                    bubble.init($(this), units, round);
                    bubble.show();
                });

                // Hide bubble
                dots.eq(i).on("mouseleave", function () {
                    bubble.hide();
                });
            }
        }

        /*======================================================================
            SHOWBARS
        ======================================================================*/
        this.showBars = function(type, units, round, y0, xMin, dX, dY) {
            // Get graph section in which bars must displayed
            var graph = this.e.find(".graph");

            // Get bars
            var bars = graph.find("." + type);

            // Get bar styles
            thicknessBorder = parseFloat(bars.first().css("border-top-width"))
                || parseFloat(bars.first().css("border-bottom-width"));

            // Extract information from bars
            var X = [];
            var Y = [];

            for (i = 0; i < bars.length; i++) {
                X[i] = parseFloat(bars.eq(i).attr("x"));
                Y[i] = parseFloat(bars.eq(i).attr("y"));
            }

            // Compute bar coordinates
            var w = [];
            var h = [];
            var y = [];

            for (i = 0; i < bars.length - 1; i++) {
                dw = X[i + 1] - X[i];
                dh = Math.abs(Y[i] - y0);
                dy = y0;

                w[i] = dw / dX * graph.outerWidth();
                h[i] = dh / dY * graph.outerHeight();
                y[i] = dy / dY * graph.outerHeight() - thicknessBorder / 2;

                // If low bar
                if (Y[i] < y0) {
                    // Move bar under baseline
                    y[i] -= h[i];

                    // Recenter bar with axis
                    y[i] += thicknessBorder;
                }
            }

            // Style bars
            for (i = 0; i < bars.length; i++) {
                // Define type of bar
                if (Y[i] > y0) {
                    bars.eq(i).addClass("high-" + type);
                } else if (Y[i] < y0) {
                    bars.eq(i).addClass("low-" + type);
                } else {
                    bars.eq(i).addClass("no-" + type);
                }

                // Push inner bars
                if (Y[i] > y0) {
                    bars.eq(i).children().css("margin-bottom", "auto");
                } else if (Y[i] < y0) {
                    bars.eq(i).children().css("margin-top", "auto");
                }

                // Draw contours
                // Higher than baseline
                if(Y[i] > y0) {
                    if(i != 0 && Y[i] > Y[i - 1]) {
                        bars.eq(i).children().first().css({
                            "height": h[i] - h[i - 1]
                        });
                    }

                    if(i != bars.length - 1 && Y[i] > Y[i + 1]) {
                        bars.eq(i).children().last().css({
                            "height": h[i] - h[i + 1]
                        });
                    }
                }
                // Lower than baseline
                else if (Y[i] < y0) {
                    if (i != 0 && Y[i] < Y[i - 1]) {
                        bars.eq(i).children().first().css({
                            "height": h[i] - h[i - 1]
                        });
                    }

                    if (i != bars.length - 1 && Y[i] < Y[i + 1]) {
                        bars.eq(i).children().last().css({
                            "height": h[i] - h[i + 1]
                        });

                    }
                }

                // Baseline crossed
                // From -1 to 1
                if (i != 0 && (
                    Y[i - 1] < y0 && Y[i] > y0 ||
                    Y[i - 1] > y0 && Y[i] < y0)) {
                    bars.eq(i).children().first().css("height", "100%");
                // From 1 to -1
                } else if (i != bars.length - 1 && (
                    Y[i + 1] < y0 && Y[i] > y0 ||
                    Y[i + 1] > y0 && Y[i] < y0)) {
                    bars.eq(i).children().last().css("height", "100%");
                }

                // Minor bars
                if (h[i] < 2 * thicknessBorder) {
                    // Only keep one line for minor bars
                    h[i] = thicknessBorder;
                    
                    if (Y[i] >= y0) {
                        bars.eq(i).css("border-top", "none");
                    } else if (Y[i] < y0) {
                        bars.eq(i).css("border-bottom", "none");
                    }

                    // Remove borders on inner bars
                    bars.eq(i).children().css("border", "none");
                }
            }

            // Position bars on graph
            for (i = 0; i < bars.length; i++) {
                bars.eq(i).css({
                    "width": w[i] + "px",
                    "height": h[i] + "px",
                    "margin-bottom": y[i] + "px"
                });
            }

            // Show bubble
            var bubble = this.bubble;

            for (i = 0; i < bars.length; i++) {
                bars.eq(i).on("mouseenter", function () {
                    bubble.init($(this), units, round);
                    bubble.show();
                });

                // Hide bubble
                bars.eq(i).on("mouseleave", function () {
                    bubble.hide();
                });
            }
        }

        /*======================================================================
            MAIN
        ======================================================================*/
        // Store node to which future graph elements should be attached
        this.e = $("#graph" + name);

        // Generate a bubble for graph
        this.bubble = new Bubble();
    }

    function Bubble() {

        /*======================================================================
            INIT
        ======================================================================*/
        this.init = function(element, units, round,
            format = "HH:MM - DD.MM.YYYY") {
            // Store element on which bubble will give infos
            this.element = element;

            // Store element units
            this.units = units;

            // Store rounding position
            this.round = round;

            // Store time format
            this.format = format;

            // Get bubble element
            this.get();

            // Update bubble
            this.update();
        }

        /*======================================================================
            GET
        ======================================================================*/
        this.get = function() {
            // Get bubble
            var bubble = $("#bubble");

            // Store bubble and its infos
            this.e = bubble;
            this.info = bubble.find("#bubble-info");
            this.time = bubble.find("#bubble-time");
        }

        /*======================================================================
            UPDATE
        ======================================================================*/
        this.update = function() {
            // Get bubble info
            var x = this.element.attr("x");
            var y = this.element.attr("y");
            var type = this.element.attr("class");

            // Convert time if desired
            if (this.format) {
                x = convertTime(x, this.format);    
            }

            // Round info if desired
            if (this.round) {
                y = round(y, this.round);
            }

            // Update infos in bubble
            this.time.html(x);
            this.info.html("<span class='" + type + "'>" + y + "</span>" +
                " " + this.units);
        }

        /*======================================================================
            SHOW
        ======================================================================*/
        this.show = function(offsetX = 8, offsetY = 0) {
            // Define bubble coordinates
            var offsetTop = parseFloat(this.element.parent().position().top);
            var x = parseFloat(this.element.position().left) +
                    parseFloat(this.element.css("width")) + offsetX;
            var y = parseFloat(this.element.position().top) + offsetY +
                    offsetTop;
            
            // Define bubble size
            var w = this.e.outerWidth();
            var h = this.e.outerHeight();

            // Adjust position of bubble due to it being in content element
            if (offsetTop) {
                y += h; // FIXME
            }

            // Position bubble on graph
            this.e.css({
                "left": x + "px",
                "top": y + "px"
            });

            // If bubble exceeds width of graph
            if (x + w > this.element.parent().outerWidth()) {
                this.e.css({
                    "left": x - 3 * offsetX - w + "px"
                });
            }

            // If bubble exceeds height of graph
            if (y + h > this.element.parent().outerHeight()) {
                this.e.css({
                    "top": y - 3 * offsetY - h + "px"
                });
            }

            // Show bubble
            this.e.show();
        }

        /*======================================================================
            HIDE
        ======================================================================*/
        this.hide = function() {
            this.e.hide();
        }
    }

    function GraphBG(name) {

        // Extend object
        Graph.apply(this, [name]);

        /*======================================================================
            COLORBGS
        ======================================================================*/
        this.colorBGs = function(BGScale) {
            // Get graph section in which are the BGs
            var graph = this.e.find(".graph");

            // Get BGs
            var BGs = graph.find(".BG");

            // Color BGs
            for (i = 0; i < BGs.length; i++) {
                BG = parseFloat(BGs.eq(i).attr("y"));
                BGs.eq(i).addClass(rankBG(BG, BGScale));
            }
        }
    }

    function GraphI(name) {

        // Extend object
        Graph.apply(this, [name]);

        /*======================================================================
            PROFILETBRS
        ======================================================================*/
        this.profileTBRs = function(data, x0, dX, dtMax = 5 * 60 * 1000) {
            // Store data in separate arrays
            var TBRTimes = [];
            var TBRs = [];
            var TBRUnits = [];
            var TBRDurations = [];

            // Decouple data
            for (i = 0; i < data[0].length; i++) {
                TBRTimes[i] = data[0][i];
                TBRs[i] = data[1][i][0];
                TBRUnits[i] = data[1][i][1];
                TBRDurations[i] = data[1][i][2] * 60 * 1000;
            }

            // Sort TBR times in case they aren't already
            indexSort(TBRTimes, [TBRs, TBRUnits, TBRDurations]);

            // Reconstruct TBR profile
            var n = TBRTimes.length; // Number of entries
            var x = []; // Times
            var y = []; // Values
            var z = []; // Units

            for (i = 0; i < n; i++) {
                // Add current point in time to allow next comparisons
                if (i == n - 1) {
                    TBRTimes.push(x0);
                    TBRs.push(y.last());
                    TBRUnits.push(z.last());
                }

                //Ignore TBR cancel associated with unit change
                if (TBRs[i] == 0 &&
                    TBRDurations[i] == 0 &&
                    TBRUnits[i + 1] != TBRUnits[i] &&
                    TBRTimes[i + 1] - TBRTimes[i] < dtMax) {
                    continue;
                }

                // Add TBR to profile if different than last
                if (TBRs[i] != y.last() || TBRUnits[i] != z.last()) {
                    x.push(TBRTimes[i]);
                    y.push(TBRs[i]);
                    z.push(TBRUnits[i]);
                }

                // Add a point in time if current TBR ran completely
                if (TBRDurations[i] != 0 &&
                    TBRTimes[i] + TBRDurations[i] < TBRTimes[i + 1]) {
                    x.push(TBRTimes[i] + TBRDurations[i]);
                    y.push(100);
                    z.push(z.last());
                }
            }

            // Add first point left of graph
            x.unshift(x0 - dX);
            y.unshift(100);
            z.unshift(TBRUnits.first());

            // Add current point in time
            x.push(TBRTimes.last());
            y.push(TBRs.last());
            z.push(TBRUnits.last());

            // Give user TBR profile
            return [x, y, z];
        }

        /*======================================================================
            BUILDTBRS
        ======================================================================*/
        this.buildTBRs = function(data, x0, dX) {

            // Compute TBR profile
            var TBRProfile = this.profileTBRs(data, x0, dX);

            // Build TBRs
            this.buildBars("TBR", [TBRProfile[0], TBRProfile[1]]);
        }
    }

    function Dash() {

        /*======================================================================
            GET
        ======================================================================*/
        this.get = function() {
            // Store dash and its infos
            this.e = $("#dash");
            this.live = this.e.find("#dash-live");
            this.delta = this.e.find("#dash-delta");
            this.basal = this.e.find("#dash-basal");
            this.onBoard = this.e.find("#dash-on-board");
            this.factors = this.e.find("#dash-factors");
            //this.age = this.e.find("#dash-age");

            this.BG = $("#dash-BG").add("#user-BG");
            this.arrow = $("#dash-arrow").add("#user-arrow");

            this.dBG = this.e.find("#dash-dBG");
            this.dBGdt = this.e.find("#dash-dBG-dt");
            this.TBR = this.e.find("#dash-TBR");
            this.BR = this.e.find("#dash-BR");
            this.IOB = this.e.find("#dash-IOB");
            this.COB = this.e.find("#dash-COB");
        }

        /*======================================================================
            UPDATE
        ======================================================================*/
        this.update = function() {
            // Get BGs and TBRs
            var BGs = $("#graphBG").find(".BG");
            var TBRs = $("#graphI").find(".TBR");

            // Get last BG infos
            var lastBG = BGs.eq(-1).attr("y");
            var lastBGType = BGs.eq(-1).attr("class");
            var dBG = round(BGs.eq(-1).attr("y") - BGs.eq(-2).attr("y"), 1);
            var dt = (parseInt(BGs.eq(-1).attr("x")) -
                parseInt(BGs.eq(-2).attr("x"))) / 1000 / 60; // (m)
            var dBGdt = round(dBG / dt, 1);

            // Update infos in dash
            this.BG.text(round(lastBG, 1));
            this.BG.addClass(lastBGType);
            this.dBG.text(dBG);
            this.dBGdt.text(dBGdt);
            this.arrow.text(rankdBGdt(dBGdt, dBGdtScale)).addClass(lastBGType);
            this.TBR.text(round(TBRs.eq(-2).attr("y"), 1));
        }
    }



    // FUNCTIONS
    function init() {

    }



    // MAIN
    // Config
    var now = new Date();
    var x = [];
    var x0 = 1474340548000;
    var dx = 1 * 60 * 60 * 1000; // Time step (h)
    var dX = 12 * 60 * 60 * 1000; // Time range (h)
    var y0 = 100; // Basal baseline (%)
    var yBG = [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15]; // mmol/L
    var dYBG = yBG.max() - yBG.min();
    var yI = [0, 100, 200]; // %
    var dYI = yI.max() - yI.min();
    var BGScale = [3, 4, 7, 12]; // (mmol/L)
    var dBGdtScale = [-0.15, -0.075, 0.075, 0.15]; // (mmol/L/m)

    // Resizing
    if ($(window).outerWidth() < 800) {
        x0 = 1474340548000 - 6 * 60 * 60 * 1000;
        dX = 6 * 60 * 60 * 1000; // Time range (h)
    }

    // Create graph objects
    var graphBG = new GraphBG("BG");
    var graphI = new GraphI("I");

    // Build x-axis for time
    graphI.buildAxis(x, x0, dx, dX, "x", "HH:MM");

    // Build y-axis for I
    graphI.buildAxis(yI, null, null, null, "y", false);

    // Build y-axis for BG
    graphBG.buildAxis(yBG, null, null, null, "y", false);

    // Get BGs
    var BGs = getData("ajax/BG.json", false,
        "YYYY.MM.DD - HH:MM:SS", [x0 - dX, x0]);

    // Build BG dots
    graphBG.buildDots("BG", BGs);

    // Show BG dots
    graphBG.showDots("BG", "mmol/L", 1, false, x0 - dX, yBG.min(), dX, dYBG);

    // Color BG dots
    graphBG.colorBGs(BGScale);

    // Get Bs
    var Bs = getData("ajax/insulin.json", "Boluses",
        "YYYY.MM.DD - HH:MM:SS", [x0 - dX, x0]);

    // Build B dots
    graphI.buildDots("B", Bs);

    // Show B dots
    graphI.showDots("B", "U", 1, y0, x0 - dX, yI.min(), dX, dYI);

    // Get TBRs
    var TBRs = getData("ajax/insulin.json", "Temporary Basals",
        "YYYY.MM.DD - HH:MM:SS", [x0 - dX, x0]);

    // Build TBR bars
    graphI.buildTBRs(TBRs, x0, dX);

    // Show TBR bars
    graphI.showBars("TBR", "%", 0, y0, x0 - dX, dX, dYI);

    // Create dash object
    var dash = new Dash();

    // Add dash to page
    dash.get();
    dash.update();



    // Elements
    var settings = $("#settings");
    var settingsButton = $("#settings-button");

    // Functions
    function toggleSettings () {
        // Get coordinates and size of settings menu
        var x = Math.abs(parseFloat(settings.css("right")));
        var X = settings.outerWidth();

        // Decide on sliding direction
        if (settings.hasClass("is-active")) {
            settings.stop().animate({
                right: "-=" + (X - x)
            });
        } else {
            settings.stop().animate({
                right: "+=" + x
            });         
        }

        // Toggle defining class
        settings.toggleClass("is-active");
    }



    // Main
    $(window).resize(function () {
        // Show BG dots
        graphBG.showDots("BG", "mmol/L", 1, false, x0 - dX, yBG.min(), dX, dYBG);

        // Show B dots
        graphI.showDots("B", "U", 1, y0, x0 - dX, yI.min(), dX, dYI);

        // Show TBR bars
        graphI.showBars("TBR", "%", 0, y0, x0 - dX, dX, dYI);
    });

    settingsButton.on("click", function () {
        toggleSettings();
    });

});