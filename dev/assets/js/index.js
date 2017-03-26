/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~========

    Title:    index.js

    Author:   David Leclerc

    Version:  0.1

    Date:     24.01.2017

    License:  GNU General Public License, Version 3
              (http://www.gnu.org/licenses/gpl.html)

    Overview: ...

    Notes:    ...

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~========*/

$(document).ready(function () {

    // OBJECTS

    function Graph (name) {

        /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            GENERATEAXIS
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        this.generateAxis = function (z0, dz, dZ) {
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

        /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            BUILDAXIS
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        this.buildAxis = function (z, z0, dz, dZ, label, format) {
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
                var t;

                axis.children().each(function () {
                    // Convert time
                    t = convertTime($(this).html(), format);

                    // Set time
                    $(this).html(t);
                });
            }

            // If x-axis
            if (label == "x") {
                // Store infos on axis
                this.x = z;
                this.dX = dZ;
                this.xMin = z.min();
                this.xMax = z.max();

                // Add dead corner
                this.buildCorner();
            }
            // If y-axis
            else if (label == "y") {
                // Store infos on axis
                this.y = z;
                this.dY = dZ;
                this.yMin = z.min();
                this.yMax = z.max();
            }

            // Append axis to graph
            this.self.append(axis);
        }

        /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            BUILDCORNER
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        this.buildCorner = function () {
            this.self.append($("<div class='graph-NA'></div>"));
        }

        /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            BUILDDOTS
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        this.buildDots = function (type, data) {
            // If inside section of graph does not already exist, create it
            var exists = true;
            var graph = this.self.find(".graph");

            if (!graph.length) {
                exists = false;
                graph = ($("<div class='graph'></div>"));

                // Append section to graph
                this.self.append(graph);
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

        /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            BUILDBARS
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        this.buildBars = function (type, data) {
            // If section of graph does not already exist, create it
            var exists = true;
            var graph = this.self.find(".graph");

            if (!graph.length) {
                exists = false;
                graph = ($("<div id='graph'></div>"));

                // Append section to graph
                this.self.append(graph);
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

        /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            SHOWDOTS
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        this.showDots = function (type, units, round, y0) {
            // Get graph section in which dots must displayed
            var graph = this.self.find(".graph");

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
                dx = X[i] - this.xMin;
                dy = y0 ? y0 : Y[i] - this.yMin;

                x[i] = dx / this.dX * graph.outerWidth()
                    - radiusDot
                    - thicknessXTick / 2;
                y[i] = dy / this.dY * graph.outerHeight()
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

            // Gradually show dots
            showGradually(dots, 25, false);

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

        /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            SHOWBARS
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        this.showBars = function (type, units, round, y0) {
            // Get graph section in which bars must displayed
            var graph = this.self.find(".graph");

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

                w[i] = dw / this.dX * graph.outerWidth();
                h[i] = dh / this.dY * graph.outerHeight();
                y[i] = dy / this.dY * graph.outerHeight() - thicknessBorder / 2;

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

            // Gradually show bars
            showGradually(bars, 100, true);

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

        /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            MAIN
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        // Store node to which future graph elements should be attached
        this.self = $("#graph-" + name);

        // Generate a bubble for graph
        this.bubble = new Bubble();
    }

    function Bubble () {

        /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            INIT
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        this.init = function (e, units, round, format = "HH:MM - DD.MM.YYYY") {
            // Store element on which bubble will give infos
            this.e = e;

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

        /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            GET
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        this.get = function () {
            // Get bubble
            var bubble = $("#bubble");

            // Store bubble and its infos
            this.self = bubble;
            this.info = bubble.find("#bubble-info");
            this.time = bubble.find("#bubble-time");
        }

        /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            UPDATE
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        this.update = function () {
            // Get infos about element
            var x = this.e.attr("x");
            var y = this.e.attr("y");
            var type = this.e.attr("class");

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

        /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            SHOW
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        this.show = function (offsetX = 8, offsetY = 0) {
            // Define bubble coordinates
            var offsetTop = parseFloat(this.e.parent().position().top);
            var x = parseFloat(this.e.position().left) +
                    parseFloat(this.e.css("width")) + offsetX;
            var y = parseFloat(this.e.position().top) + offsetY + offsetTop;
            
            // Define bubble size
            var w = this.self.outerWidth();
            var h = this.self.outerHeight();

            // Adjust position of bubble due to it being in content element
            if (offsetTop) {
                y += h; // FIXME
            }

            // Position bubble on graph
            this.self.css({
                "left": x + "px",
                "top": y + "px"
            });

            // If bubble exceeds width of graph
            if (x + w > this.e.parent().outerWidth()) {
                this.self.css({
                    "left": x - 3 * offsetX - w + "px"
                });
            }

            // If bubble exceeds height of graph
            if (y + h > this.e.parent().outerHeight()) {
                this.self.css({
                    "top": y - 3 * offsetY - h + "px"
                });
            }

            // Show bubble
            this.self.show();
        }

        /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            HIDE
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        this.hide = function () {
            this.self.hide();
        }
    }

    function GraphBG (name) {

        // Extend object
        Graph.apply(this, [name]);

        /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            COLORBGS
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        this.colorBGs = function (BGScale) {
            // Get graph section in which are the BGs
            var graph = this.self.find(".graph");

            // Get BGs
            var BGs = graph.find(".BG");

            // Color BGs
            for (i = 0; i < BGs.length; i++) {
                BG = parseFloat(BGs.eq(i).attr("y"));
                BGs.eq(i).addClass(rankBG(BG, BGScale));
            }
        }
    }

    function GraphI (name) {

        // Extend object
        Graph.apply(this, [name]);

        /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            PROFILETBRS
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        this.profileTBRs = function (data, dt = 5 * 60 * 1000) {
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
                    TBRTimes.push(this.xMax);
                    TBRs.push(y.last());
                    TBRUnits.push(z.last());
                }

                //Ignore TBR cancel associated with unit change
                if (TBRs[i] == 0 &&
                    TBRDurations[i] == 0 &&
                    TBRUnits[i + 1] != TBRUnits[i] &&
                    TBRTimes[i + 1] - TBRTimes[i] < dt) {
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
            x.unshift(this.xMin);
            y.unshift(100);
            z.unshift(TBRUnits.first());

            // Add current point in time
            x.push(TBRTimes.last());
            y.push(TBRs.last());
            z.push(TBRUnits.last());

            // Give user TBR profile
            return [x, y, z];
        }

        /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            BUILDTBRS
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        this.buildTBRs = function (data) {

            // Compute TBR profile
            var TBRProfile = this.profileTBRs(data);

            // Build TBRs
            this.buildBars("TBR", [TBRProfile[0], TBRProfile[1]]);
        }
    }

    function Dash () {

        /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            GET
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        this.get = function () {
            // Store dash and its infos
            this.self = $("#dash");
            this.live = this.self.find("#dash-live");
            this.delta = this.self.find("#dash-delta");
            this.basal = this.self.find("#dash-basal");
            this.onBoard = this.self.find("#dash-on-board");
            this.factors = this.self.find("#dash-factors");
            //this.age = this.self.find("#dash-age");

            this.BG = $("#dash-BG").add("#user-BG");
            this.arrow = $("#dash-arrow").add("#user-arrow");

            this.dBG = this.self.find("#dash-dBG");
            this.dBGdt = this.self.find("#dash-dBG-dt");
            this.TBR = this.self.find("#dash-TBR");
            this.BR = this.self.find("#dash-BR");
            this.IOB = this.self.find("#dash-IOB");
            this.COB = this.self.find("#dash-COB");
        }

        /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            UPDATE
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        this.update = function () {
            // Get BGs and TBRs
            var BGs = $("#graph-BG").find(".BG");
            var TBRs = $("#graph-I").find(".TBR");

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
    function init () {

    }



    // MAIN
    // Config
    var now = new Date();
    var x = [];
    var x0 = now.getTime();
    var dx = 1 * 60 * 60 * 1000; // Time step (h)
    var dX = 12 * 60 * 60 * 1000; // Time range (h)
    var y0 = 100; // Basal baseline (%)
    var yBG = [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15]; // mmol/L
    var dYBG = yBG.max() - yBG.min();
    var yI = [0, 100, 200]; // %
    var dYI = yI.max() - yI.min();
    var BGScale = [3.8, 4.2, 7.0, 12.0]; // (mmol/L)
    var dBGdtScale = [-0.15, -0.075, 0.075, 0.15]; // (mmol/L/m)

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
    var BGs = getData("ajax/BG.json", false,
        "YYYY.MM.DD - HH:MM:SS", [x0 - dX, x0]);

    // Build BG dots
    graphBG.buildDots("BG", BGs);

    // Show BG dots
    graphBG.showDots("BG", "mmol/L", 1, false);

    // Color BG dots
    graphBG.colorBGs(BGScale);

    // Get Bs
    var Bs = getData("ajax/treatments.json", "Boluses",
        "YYYY.MM.DD - HH:MM:SS", [x0 - dX, x0]);

    // Build B dots
    graphI.buildDots("B", Bs);

    // Show B dots
    graphI.showDots("B", "U", 1, y0);

    // Get TBRs
    var TBRs = getData("ajax/treatments.json", "Temporary Basals",
        "YYYY.MM.DD - HH:MM:SS", [x0 - dX, x0]);

    // Build TBR bars
    graphI.buildTBRs(TBRs);

    // Show TBR bars
    graphI.showBars("TBR", "%", 0, y0);

    // Create dash object
    var dash = new Dash();

    // Add dash to page
    dash.get();
    dash.update();



    // Elements
    var user = $("#user");
    var dash = $("#dash");
    var settings = $("#settings");
    var settingsButton = $("#settings-button");

    // Functions

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