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

    function Graph(name, e) {

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
        this.buildAxis = function(z, z0, dz, dZ, label, name, format) {
            // Create axis node
            var axis = $("<div id='graph-" + name + "-axis' class='graph-" +
                label + "-axis'></div>");

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

            // Append axis to graph
            this.e.append(axis);
        }

        /*======================================================================
            BUILDCORNER
        ======================================================================*/
        this.buildCorner = function() {
            // If graph corner does not already exist, create it
            var exists = this.e.find("#graph-NA").length;

            if (!exists) {
                this.e.append($("<div id='graph-NA'></div>"));
            }
        }

        /*======================================================================
            BUILDDOTS
        ======================================================================*/
        this.buildDots = function(type, data) {
            // If section of graph does not already exist, create it
            var exists = true;
            var section = this.e.find("#graph-" + this.name);

            if (!section.length) {
                exists = false;
                section = ($("<div id='graph-" + this.name + "'></div>"));
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

            // Append dots to graph section
            section.append(dots);

            // Append section to whole graph if it does not already exist
            if (!exists) {
                this.e.append(section);
            }
        }

        /*======================================================================
            SHOWDOTS
        ======================================================================*/
        this.showDots = function(type, y0, xMin, yMin, dX, dY) {
            // Get graph section in which dots must displayed
            var section = this.e.find("#graph-" + this.name);

            // Get dots and axis ticks
            var dots = section.find("." + type);
            var xTicks = this.e.find(".graph-x-axis-tick");
            var yTicks = this.e.find(".graph-y-axis-tick");

            // Get dot styles
            var radiusDot = parseFloat(dots.first().outerWidth()) / 2;
            var thicknessXTick = parseFloat(xTicks.first().css("border-width"));
            var thicknessYTick = parseFloat(yTicks.first().css("border-width"));

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

                x[i] = dx / dX * section.outerWidth()
                    - radiusDot
                    - thicknessXTick / 2;
                y[i] = dy / dY * section.outerHeight()
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
            for (i = 0; i < dots.length; i++) {
                dots.eq(i).on("mouseenter", function () {
                    buildBubble($(this));
                });

                // Hide bubble
                dots.eq(i).on("mouseleave", function () {
                    bubble.hide();
                });
            }
        }

        /*======================================================================
            BUILDBARS
        ======================================================================*/
        this.buildBars = function(type, data) {
            // If section of graph does not already exist, create it
            var exists = true;
            var section = this.e.find("#graph-" + this.name);

            if (!section.length) {
                exists = false;
                section = ($("<div id='graph-" + this.name + "'></div>"));
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

            // Append bars to graph section
            section.append(bars);

            // Append section to whole graph if it does not already exist
            if (!exists) {
                this.e.append(section);
            }
        }

        /*======================================================================
            SHOWBARS
        ======================================================================*/
        this.showBars = function(type, y0, xMin, dX, dY) {
            // Get graph section in which bars must displayed
            var section = this.e.find("#graph-" + this.name);
            var bars = section.find("." + type);

            // Get bar styles
            thicknessBarBorder = parseFloat(bars.first().css("border-width"));

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

                w[i] = dw / dX * section.outerWidth();
                h[i] = dh / dY * section.outerHeight();
                y[i] = dy / dY * section.outerHeight() - thicknessBarBorder / 2;

                // If low bar
                if (Y[i] < y0) {
                    // Move bar under baseline
                    y[i] -= h[i];

                    // Recenter bar with axis
                    y[i] += thicknessBarBorder;
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
                if (h[i] < 2 * thicknessBarBorder) {
                    // Only keep one line for minor bars
                    h[i] = thicknessBarBorder;
                    
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
            for (i = 0; i < bars.length; i++) {
                bars.eq(i).on("mouseenter", function () {
                    buildBubble($(this));
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
        // Store graph name
        this.name = name;

        // Store node to which future graph elements should be attached
        this.e = e;

        // Make sure dead corner exists
        this.buildCorner();
    }

    function GraphBG(name, e) {

        // Extend object
        Graph.apply(this, [name, e]);

        /*======================================================================
            COLORBGS
        ======================================================================*/
        this.colorBGs = function(BGScale) {
            // Get graph section in which are the BGs
            var section = this.e.find("#graph-" + this.name);

            // Get BGs
            var BGs = section.find(".BG");

            // Color BGs
            for (i = 0; i < BGs.length; i++) {
                BG = parseFloat(BGs.eq(i).attr("y"));
                BGs.eq(i).addClass(rankBG(BG, BGScale));
            }
        }
    }

    function GraphI(name, e) {

        // Extend object
        Graph.apply(this, [name, e]);

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

    }

    function Bubble() {

    }

    // New config
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

    // FIXME: reinsert rounding functions?

    // Create graph objects
    var graphBG = new GraphBG("BG", $("#graph"));
    var graphI = new GraphI("I", $("#graph"));

    // Build x-axis for time
    graphBG.buildAxis(x, x0, dx, dX, "x", "t", "HH:MM");

    // Build y-axis for BG
    graphBG.buildAxis(yBG, null, null, null, "y", "BG", false);

    // Build y-axis for I
    graphI.buildAxis(yI, null, null, null, "y", "I", false);

    // Get BGs
    var BGs = getData("ajax/BG.json", false,
        "YYYY.MM.DD - HH:MM:SS", [x0 - dX, x0]);

    // Build BG dots
    graphBG.buildDots("BG", BGs);

    // Show BG dots
    graphBG.showDots("BG", false, x0 - dX, yBG.min(), dX, dYBG);

    // Color BG dots
    graphBG.colorBGs(BGScale);

    // Get Bs
    var Bs = getData("ajax/insulin.json", "Boluses",
        "YYYY.MM.DD - HH:MM:SS", [x0 - dX, x0]);

    // Build B dots
    graphI.buildDots("B", Bs);

    // Show B dots
    graphI.showDots("B", y0, x0 - dX, yI.min(), dX, dYI);

    // Get TBRs
    var TBRs = getData("ajax/insulin.json", "Temporary Basals",
        "YYYY.MM.DD - HH:MM:SS", [x0 - dX, x0]);

    // Build TBR bars
    graphI.buildTBRs(TBRs, x0, dX);

    // Show TBR bars
    graphI.showBars("TBR", y0, x0 - dX, dX, dYI);





    // Elements
    var header = $("header");
    var loader = $("#loader");
    var graph = $("#graph");
    var graphBG = $("#graph-BG");
    var graphI = $("#graph-I");
    var xAxis = $("#graph-x-axis");
    var yAxisBG = $("#graph-y-axis-BG");
    var yAxisTBR = $("#graph-y-axis-I");
    var dash = $("#dash");
    var dashBG = dash.find(".BG");
    var dashArrow = dash.find(".arrow");
    var dashdBG = dash.find(".dBG");
    var dashdBGdt = dash.find(".dBG-dt");
    var dashTBR = dash.find(".TBR");
    var dashBR = dash.find(".BR");
    var dashIOB = dash.find(".IOB");
    var dashCOB = dash.find(".COB");
    var settings = $("#settings");
    var settingsButton = $("#settings-button");
    var bubble = $("#bubble");
    var bubbleInfo = bubble.find(".info");
    var bubbleTime = bubble.find(".time");
    var BGDots = graphBG.find(".BG");
    var TBRBars = graphI.find(".TBR");
    var BDots = graphI.find(".B");

    // Functions
    function buildBubble (e) {
        // Get time
        var t = convertTime(e.attr("x"), "HH:MM - DD.MM.YYYY");

        // Add time
        bubbleTime.html(t);

        if (e.hasClass("BG")) {
            // Get info
            var BG = roundBG(e.attr("y"));
            var BGType = rankBG(BG, BGScale);

            // Add info to bubble
            bubbleInfo.html("<span class='BG " + BGType + "'>" + BG + "</span> mmol/L");
        } else if (e.hasClass("TBR")) {
            // Get info
            var TBR = roundTBR(e.attr("y"));

            // Add info to bubble
            bubbleInfo.html("<span class='TBR'>" + TBR + "</span>%");
        } else if (e.hasClass("B")) {
            // Get info
            var B = roundB(e.attr("y"));

            // Add info to bubble
            bubbleInfo.html("<span class='B'>" + B + "</span> U");
        }

        // Define bubble coordinates
        var x = parseFloat(e.offset().left) + parseFloat(e.css("width")) + 5;
        var y = parseFloat(e.offset().top) - header.outerHeight();


        // Position bubble on graph
        bubble.css({
            "left": x + "px",
            "top": y + "px"
        });

        // If bubble exceeds width of graph
        if (x + bubble.outerWidth() > graph.outerWidth()) {
            bubble.css({
                "left": x - 1.5 * 10 - bubble.outerWidth() + "px"
            });
        }

        // If bubble exceeds height of graph
        if (y + bubble.outerHeight() > graph.outerHeight()) {
            bubble.css({
                "top": y - 1.5 * 10 - bubble.outerHeight() + "px"
            });
        }

        // Show bubble
        bubble.show();
    }

    function buildDash () {
        // Get last BG
        var lastBG = roundBG(BGDots.eq(-1).attr("y"));
        var lastBGType = rankBG(lastBG, BGScale);

        // Add to dash
        dashBG.text(lastBG);

        // Color last BG
        dashBG.addClass(lastBGType);

        // Get dBG over last 5 minutes
        var dBG = roundBG(BGDots.eq(-1).attr("y") - BGDots.eq(-2).attr("y"));

        // Add to dash
        dashdBG.text(dBG);

        // Get dBG/dt over last 5 minutes
        var dt = (parseInt(BGDots.eq(-1).attr("x")) - parseInt(BGDots.eq(-2).attr("x"))) / 1000 / 60; // (m)
        var dBGdt = roundBG(dBG / dt);

        // Add to dash
        dashdBGdt.text(dBGdt);

        // Select arrow and add it to dash
        dashArrow.text(rankdBGdt(dBGdt, dBGdtScale));

        // Color arrow
        dashArrow.addClass(lastBGType);

        // Get current TBR
        var TBR = roundTBR(TBRBars.eq(-2).attr("y"));

        // Add to dash
        dashTBR.text(TBR);
    }

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
    buildDash();

    $(window).resize(function () {

    });

    settingsButton.on("click", function () {
        toggleSettings();
    });

});