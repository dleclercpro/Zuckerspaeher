M.Graph = function Graph (name) {

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
    };

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
                    label + "-axis-tick'>" + z[i + 1] + "</div>")
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
    };

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     BUILDCORNER
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    this.buildCorner = function () {
        this.self.append($("<div class='graph-NA'></div>"));
    };

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     BUILDDOTS
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    this.buildDots = function (type, data) {

        // If inside section of graph does not already exist, create it
        var graph = this.self.find(".graph");

        // If graph does not already exist
        if (!graph.length) {

            // Generate inner section
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
    };

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     SHOWDOTS
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    this.showDots = function (type, units, round, y0) {

        // Get inner section in which dots must displayed
        var graph = this.self.find(".graph");

        // Get graph dimensions
        var graphW = graph.outerWidth();
        var graphH = graph.outerHeight();

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

            x[i] = dx / this.dX * graphW
                - radiusDot
                - thicknessXTick / 2;
            y[i] = dy / this.dY * graphH
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

        for (i = 0; i < dots.length; i++) {
            dots.eq(i).on("mouseenter", function () {
                this.bubble.init($(this), units, round);
                this.bubble.show();
            });

            // Hide bubble
            dots.eq(i).on("mouseleave", function () {
                this.bubble.hide();
            });
        }
    };

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     BUILDBARS
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    this.buildBars = function (type, data) {

        // If inside section of graph does not already exist, create it
        var graph = this.self.find(".graph");

        // If graph does not already exist
        if (!graph.length) {

            // Generate inner section
            graph = ($("<div class='graph'></div>"));

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
            bars[i] = $("<div class='" + type + "' x=" + x[i] +
                " y=" + y[i] + "></div>");

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
    };

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     SHOWBARS
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    this.showBars = function (type, units, round, y0) {

        // Get inner section in which bars must displayed
        var graph = this.self.find(".graph");

        // Get graph dimensions
        var graphW = graph.outerWidth();
        var graphH = graph.outerHeight();

        // Get bars
        var bars = graph.find("." + type);
        var n = bars.length - 1

        // Get bar styles
        thicknessBorder = parseFloat(bars.first().css("border-top-width"))
            || parseFloat(bars.first().css("border-bottom-width"));

        // Extract information from bars
        var x = [];
        var y = [];

        for (i = 0; i < bars.length; i++) {
            x[i] = parseFloat(bars.eq(i).attr("x"));
            y[i] = parseFloat(bars.eq(i).attr("y"));
        }

        // Compute space between last bar and now
        dW = this.xMax - x.last();
        W = dW / this.dX * graphW;

        // Push bars according to time difference between last bar and now
        graph.children().last().css("margin-right", W);

        // Compute bar sizes
        var w = [];
        var b = [];

        for (i = 0; i < n; i++) {
            dw = x[i + 1] - x[i];

            w[i] = dw / this.dX * graphW;
            y[i] = y[i] / this.dY * graphH;
            b[i] = (y0 - this.yMin) / this.dY * graphH - thicknessBorder / 2;
        }

        // Style bars
        for (i = 0; i < n; i++) {

            // Define type of bar
            if (y[i] > 0) {
                bars.eq(i).addClass("high-" + type);
            }
            else if (y[i] < 0) {
                bars.eq(i).addClass("low-" + type);
            }
            else {
                bars.eq(i).addClass("no-" + type);
            }

            // Push inner bars
            if (y[i] > 0) {
                bars.eq(i).children().css("margin-bottom", "auto");
            }
            else if (y[i] < 0) {
                bars.eq(i).children().css("margin-top", "auto");
            }

            // Draw contours
            // Higher than baseline
            if (y[i] > 0) {
                if (i != 0 && y[i] > y[i - 1]) {
                    bars.eq(i).children().first().css({
                        "height": y[i] - y[i - 1]
                    });
                }

                if (i != n && y[i] > y[i + 1]) {
                    bars.eq(i).children().last().css({
                        "height": y[i] - y[i + 1]
                    });
                }
            }
            // Lower than baseline
            else if (y[i] < 0) {
                if (i != 0 && y[i] < y[i - 1]) {
                    bars.eq(i).children().first().css({
                        "height": Math.abs(y[i] - y[i - 1])
                    });
                }

                if (i != n && y[i] < y[i + 1]) {
                    bars.eq(i).children().last().css({
                        "height": Math.abs(y[i] - y[i + 1])
                    });

                }
            }

            // Baseline crossed
            // From -1 to 1
            if (i != 0 && (
                y[i - 1] < 0 && y[i] > 0 ||
                y[i - 1] > 0 && y[i] < 0)) {
                bars.eq(i).children().first().css("height", "100%");
                // From 1 to -1
            }
            else if (i != n && (
                y[i + 1] < 0 && y[i] > 0 ||
                y[i + 1] > 0 && y[i] < 0)) {
                bars.eq(i).children().last().css("height", "100%");
            }

            // Minor bars
            if (Math.abs(y[i]) < 2 * thicknessBorder) {
                // Remove unnecessary borders and shift bar back to baseline
                if (y[i] >= 0) {
                    bars.eq(i).css("border-top", "none");
                }
                else if (y[i] < 0) {
                    bars.eq(i).css("border-bottom", "none");
                }

                // Only keep one line for minor bars
                y[i] = thicknessBorder;

                // Remove borders on inner bars
                bars.eq(i).children().css("border", "none");
            }

            // If low bar
            if (y[i] < 0) {

                // Move bar under baseline
                b[i] += y[i];

                // Recenter bar with axis
                b[i] += thicknessBorder;
            }
        }

        // Get bubble
        var bubble = this.bubble;

        // Complete bars
        for (i = 0; i < n; i++) {

            // Position bars on graph
            bars.eq(i).css({
                "width": w[i] + "px",
                "height": Math.abs(y[i]) + "px",
                "margin-bottom": b[i] + "px"
            });

            // Show bubble
            bars.eq(i).on("mouseenter", function () {
                bubble.init($(this), units, round);
                bubble.show();
            });

            // Hide bubble
            bars.eq(i).on("mouseleave", function () {
                bubble.hide();
            });
        }
    };

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     INIT
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

    // Define graph components
    this.self = $("#graph-" + name);
    //this.NA = this.self.find('.graph-NA');
    //this.x = this.self.find('.graph-x-axis');
    //this.y = this.self.find('.graph-y-axis');
    //this.inner = this.self.find('.graph');

    // Generate a bubble for graph
    this.bubble = new M.Bubble();
};