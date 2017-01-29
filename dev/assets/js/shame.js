function simulateBG() {
    var x0 = 1484760242000;
    var x = [];
    var y = [];
    var dx = 5 * 60 * 1000; // ms
    var dX = 12 * 60 * 60 * 1000; // ms
    var u = 0;
    var u_0 = 15;
    var A = 23;
    var B = 2;
    var k = 2;
    var ticks = [];

    // Create epoch time scale
    for (i = 0; i < (dX / dx); i++) {
        x.unshift(x0 - i * dx);
    }

    x.unshift(x0 - dX);

    for (i = 0; i < x.length; i++) {
        u = (x[i] - (x0 - dX)) / 1000000;

        if (u >= u_0) {
            y.push(A * Math.pow((u - u_0), k) * Math.exp(-(u - u_0)) + B);
        } else {
            y.push(B);
        }
    }

    for (i = 0; i < x.length; i++) {
        ticks.push($("<div class='BG' x='" + x[i] + "' y='" + roundBG(y[i]) + "'></div>"));
    }

    graphBG.append(ticks);
}

function simulateTBR() {
    var x0 = 1484760242000;
    var x = [];
    var y = [];
    var dx = 5 * 60 * 1000; // ms
    var dX = 12 * 60 * 60 * 1000; // ms
    var u = 0;
    var u_0 = 15;
    var A = 180;
    var B = 100;
    var k = 2;
    var ticks = [];

    // Create epoch time scale
    for (i = 0; i < (dX / dx); i++) {
        x.unshift(x0 - i * dx);
    }

    x.unshift(x0 - dX);

    for (i = 0; i < x.length; i++) {
        u = (x[i] - (x0 - dX)) / 1000000;

        if (u >= u_0) {
            y.push(A * Math.pow((u - u_0), k) * Math.exp(-(u - u_0)) + B);
        } else {
            y.push(B);
        }
    }

    for (i = 0; i < x.length; i++) {
        ticks.push($("<div class='TBR' x='" + x[i] + "' y='" + roundTBR(y[i]) + "'></div>"));

        for (j = 0; j < 2; j++) {
            ticks.last().append($("<div class='innerTBR'></div>"));
        }
    }

    graphI.append(ticks);
}

function simulateBolus() {
    var x0 = 1484760242000;
    var x = [];
    var y = [];
    var dx = 25 * 60 * 1000; // ms
    var dX = 1 * 60 * 60 * 1000; // ms
    var ticks = [];

    // Create epoch time scale
    for (i = 0; i < (dX / dx); i++) {
        x.unshift(x0 - i * dx);
    }

    x.unshift(x0 - dX);

    for (i = 0; i < x.length; i++) {
        y.push(0);
    }

    for (i = 0; i < x.length; i++) {
        ticks.push($("<div class='B' x='" + x[i] + "' y='" + y[i] + "'></div>"));
    }

    graphI.append(ticks);
}

function getBGs () {
    // Create BG arrays
    var BGTimes = [];
    var BGs = [];

    // Turn off async AJAX
    $.ajaxSetup({
        async: false
    });

    // Get boluses with AJAX
    $.getJSON("ajax/BG.json", function (data) {
        // Store boluses with epoch time
        $.each(data, function (key, value) {
            BGTimes.push(convertTime(key, "YYYY.MM.DD - HH:MM:SS"));
            BGs.push(value);
        });
    });

    // Turn on async AJAX
    $.ajaxSetup({
        async: true
    });

    // Display BGs
    for (i = 0; i < BGs.length; i++) {
        if (BGTimes[i] > x0) {
            break;
        }
        
        graphBG.append($("<div class='BG' x='" + BGTimes[i] + "' y='" + roundBG(BGs[i]) + "'></div>"));
    }

    // Return boluses
    return [BGTimes, BGs];
}

function getBs () {
    // Create bolus arrays
    var BTimes = [];
    var Bs = [];

    // Turn off async AJAX
    $.ajaxSetup({
        async: false
    });

    // Get boluses with AJAX
    $.getJSON("ajax/insulin.json", function (data) {
        // Store boluses with epoch time
        $.each(data["Boluses"], function (key, value) {
            BTimes.push(convertTime(key, "YYYY.MM.DD - HH:MM:SS"));
            Bs.push(value);
        });
    });

    // Turn on async AJAX
    $.ajaxSetup({
        async: true
    });

    // Display boluses
    for (i = 0; i < Bs.length; i++) {
        if (BTimes[i] > x0) {
            break;
        }
        
        graphI.append($("<div class='B' x='" + BTimes[i] + "' y='" + roundB(Bs[i]) + "'></div>"));
    }

    // Return boluses
    return [BTimes, Bs];
}

function getTBRs () {
    // Get TBRs
    var data = getData("ajax/insulin.json", "Temporary Basals", "YYYY.MM.DD - HH:MM:SS", [x0 - dX, x0]);

    // Compute TBR profile
    var TBRProfile = profileTBR(data, x0, dX, 5 * 60 * 1000);

    // Display TBRs
    for (i = 0; i < TBRProfile[0].length; i++) {
        graphI.append($("<div class='TBR' x='" + TBRProfile[0][i] + "' y='" + roundTBR(TBRProfile[1][i]) + "'></div>"));

        for (j = 0; j < 2; j++) {
            graphI.children().last().append($("<div class='innerTBR'></div>"));
        }
    }
}

function buildGraph () {
    BGDots = graphBG.find(".BG");
    TBRBars = graphI.find(".TBR");
    BDots = graphI.find(".B");
    xTicks = $(".graph-x-axis-tick");
    yTicks = $(".graph-y-axis-tick");
    radiusBGDot = parseInt(BGDots.first().outerWidth()) / 2;
    radiusBDot = parseInt(BDots.first().outerWidth()) / 2;
    thicknessTBRBarBorder = parseInt(TBRBars.first().css("border-top-width")) || parseInt(TBRBars.first().css("border-bottom-width"));
    thicknessXTick = parseInt(xTicks.first().css("border-right-width"));
    thicknessYTick = parseInt(yTicks.first().css("border-bottom-width"));

    // BGs
    //for (i = 0; i < BGDots.length; i++) {
        // Actualize BG
        //var BGDot = BGDots.eq(i);

        // Build BG
        //buildElement(BGDot);
    //}

    // TBRs
    //for (i = 0; i < TBRBars.length; i++) {
        // Actualize TBR
        //var TBRBar = TBRBars.eq(i);

        // Build TBR
        //buildElement(TBRBar);
    //}

    // Boluses
    //for (i = 0; i < BDots.length; i++) {
        // Actualize bolus
        //var BDot = BDots.eq(i);

        // Build bolus
        //buildElement(BDot);
    //}
}

function buildElement(e) {
    // Get time
    var t0 = parseInt(e.attr("x"));
    var t1 = parseInt(e.next().attr("x"));

    if (e.hasClass("BG")) {
        // Get BG
        var BG = parseFloat(e.attr("y"));

        // Compute BG tick coordinates
        var x = (t0 - (x0 - dX)) / dX * graphBG.outerWidth() - radiusBGDot - thicknessXTick / 2;
        var y = BG / yBGMax * graphBG.outerHeight() - radiusBGDot + thicknessYTick / 2;

        // Color BG tick
        e.addClass(rankBG(BG, BGScale));

        // Position BG on graph
        e.css({
            "left": x + "px",
            "bottom": y + "px"
        });
    } else if (e.hasClass("TBR")) {
        // Get TBRs
        var prevTBR = parseInt(e.prev().attr("y"));
        var TBR = parseInt(e.attr("y"));
        var nextTBR = parseInt(e.next().attr("y"));

        // Compute TBR bar coordinates
        var x = (t0 - (x0 - dX)) / dX * graphI.outerWidth();
        var y = 100 / yIMax * graphI.outerHeight() - thicknessTBRBarBorder / 2;
        var w = (t1 - t0) / dX * graphI.outerWidth();
        var h = Math.abs((TBR - 100) / yIMax * graphI.outerHeight());
        var prevH = Math.abs((prevTBR - 100) / yIMax * graphI.outerHeight());
        var nextH = Math.abs((nextTBR - 100) / yIMax * graphI.outerHeight());

        // For high TBR
        if (TBR > 100) {
            // Add class to TBR
            e.addClass("high-TBR");

            // Push inner bars up
            e.children().css({
                "margin-bottom": "auto"
            });

            // Draw contour
            if (TBR > prevTBR) {
                e.children().first().css({
                    "height": h - prevH
                });
            }

            if (TBR > nextTBR) {
                e.children().last().css({
                    "height": h - nextH
                });
            }
        } 
        // For low TBR
        else if (TBR < 100) {
            // Add class to TBR
            e.addClass("low-TBR");

            // Push inner bars down
            e.children().css({
                "margin-top": "auto"
            });

            // Draw contour
            if (TBR < prevTBR) {
                e.children().first().css({
                    "height": h - prevH
                });
            }

            if (TBR < nextTBR) {
                e.children().last().css({
                    "height": h - nextH
                });
            }
        }
        // For no TBR
        else {
            // Add class to TBR
            e.addClass("no-TBR");
        }

        // TBR crosses baseline
        if (prevTBR < 100 && TBR > 100) {
            e.children().first().css({
                "height": "100%",
            });

            e.prev().children().last().css({
                "height": "100%",
            });
        } else if (nextTBR < 100 && TBR > 100) {
            e.children().last().css({
                "height": "100%",
            });

            e.next().children().first().css({
                "height": "100%",
            });
        }

        // Minor TBRs
        if (h < 2 * thicknessTBRBarBorder) {
            h = thicknessTBRBarBorder;

            e.children().css({
                "border": "none"
            });

            if (TBR >= 100) {
                e.css({
                    "border-top": "none"
                });
            } else if (TBR < 100) {
                e.css({
                    "border-bottom": "none"
                });
            }
        }

        // Low TBRs
        if (TBR < 100) {
            // Move bar under baseline
            y -= h;

            // Recenter bar with Y-Axis
            y += thicknessTBRBarBorder;
        }

        // Position TBR on graph
        e.css({
            "left": x + "px",
            "bottom": y + "px",
            "width": w + "px",
            "height": h + "px"
        });
    } else if (e.hasClass("B")) {
        // Get bolus
        var B = parseFloat(e.attr("y"));

        // Compute BG tick coordinates
        var x = (t0 - (x0 - dX)) / dX * graphI.outerWidth() - radiusBDot - thicknessXTick / 2;
        var y = 100 / yIMax * graphI.outerHeight() - radiusBDot + thicknessYTick / 2;

        // Position BG on graph
        e.css({
            "left": x + "px",
            "bottom": y + "px"
        });
    }

    // Show bubble
    e.on("mouseenter", function () {
        buildBubble($(this));
    });

    // Hide bubble
    e.on("mouseleave", function () {
        bubble.hide();
    });
}

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

    // Select dash-arrow and add it to dash
    dashArrow.text(rankdBGdt(dBGdt, dBGdtScale));

    // Color dash-arrow
    dashArrow.addClass(lastBGType);

    // Get current TBR
    var TBR = roundTBR(TBRBars.eq(-2).attr("y"));

    // Add to dash
    dashTBR.text(TBR);
}