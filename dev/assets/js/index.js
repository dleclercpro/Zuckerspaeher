$(document).ready(function()
{
	// Config
	var now = new Date();
	var x0 = now.getTime();
	var x = [];
	var xStr = [];
	var y = [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15]; // mmol/L
	var yMin = y.min();
	var yMax = y.max();
	var yTBR = [0, 100, 200]; // %
	var yTBRMin = yTBR.min();
	var yTBRMax = yTBR.max();
	var dx = 1; // Time step (h)
	var dX = 12; // Time range (h)
	var dy; // BG step (mmol/L)
	var dY = yMax - yMin; // BG range (mmol/L)
	var dyTBR;
	var dYTBR = yTBRMax - yTBRMin;
	var xTicks = [];
	var yTicks = [];
	var yTBRTicks = [];
	var BGScale = [3, 4, 7, 12]; // (mmol/L)
	var dBGdtScale = [-0.15, -0.075, 0.075, 0.15]; // (mmol/L/m)

	// Elements
	var header = $("header");
	var loader = $("#loader");
	var graph = $("#graph");
	var graphBG = $("#graph-inner-bg");
	var graphTBR = $("#graph-inner-tbr");
	var dash = $("#dash");
	var dashBG = dash.find(".BG");
	var dashArrow = dash.find(".arrow");
	var dashdBG = dash.find(".dBG");
	var dashdBGdt = dash.find(".dBG-dt");
	var dashTBR = dash.find(".TBR");
	var dashBR = dash.find(".BR");
	var dashIOB = dash.find(".IOB");
	var dashCOB = dash.find(".COB");
	var xAxis = $("#graph-x-axis");
	var YAxis = $("#graph-y-axis-bg");
	var YAxisTBR = $("#graph-y-axis-tbr");
	var settings = $("#settings");
	var settingsButton = $("#settings-button");
	var bubble = $("#bubble");
	var bubbleInfo = bubble.find(".info");
	var bubbleTime = bubble.find(".time");
	var BGDots;
	var TBRBars;
	
	// Sizes
	var widthSettings = "25%";
	var radiusBGDot;
	var thicknessTBRBarBorder;
	var thicknessXAxisTick;
	var thicknessYAxisTick;

	// Functions
	function init() {
		buildXAxis();
		buildYAxis();
		simulateBG();
		simulateTBR();
		buildGraph();
		buildDash();
	}

	function buildXAxis () {
		// Convert time step and range from h to ms
		dx *= 60 * 60 * 1000;
		dX *= 60 * 60 * 1000;

		// Create epoch time scale
		for (i = 0; i < (dX / dx); i++) {
			x.unshift(x0 - i * dx);
		}

		// Add last tick based on given dX
		x.unshift(x0 - dX);

		// Format epoch to string
		for (i = 0; i < x.length; i++) {
			xStr.push(convertTime(x[i], "HH:MM"));
		}

		// Create X-Axis
		for (i = 0; i < x.length - 1; i++) {
			// Create tick
			xTicks.push($("<div class='graph-x-axis-tick'>" + xStr[i + 1] + "</div>"));

			// Style tick
			xTicks[i].css({
				"width": ((x[i + 1] - x[i]) / dX * 100) + "%"
			});

			// Add tick to graph
			xAxis.append(xTicks[i]);
		}
	}

	function buildYAxis () {
		// Create Y-Axis
		for (i = 0; i < y.length - 1; i++) {
			// Compute dy
			dy = y[i + 1] - y[i];

			// Create tick
			yTicks.push($("<div class='graph-y-axis-tick'>" + y[i] + "</div>"));

			// Style tick
			yTicks[i].css({
				"height": (dy / dY * 100) + "%"
			});

			// Add tick to DOM
			YAxis.append(yTicks[i]);
		}

		for (i = 0; i < yTBR.length - 1; i++) {
			// Compute dy
			dyTBR = yTBR[i + 1] - yTBR[i];

			// Create tick
			yTBRTicks.push($("<div class='graph-y-axis-tick'>" + yTBR[i] + "</div>"));

			// Style tick
			yTBRTicks[i].css({
				"height": (dyTBR / dYTBR * 100) + "%"
			});

			// Add tick to DOM
			YAxisTBR.append(yTBRTicks[i]);
		}
	}

	function buildGraph () {
		BGDots = $("#graph-inner-bg > .BG");
		TBRBars = $("#graph-inner-tbr > .TBR");
		radiusBGDot = parseInt(BGDots.first().outerWidth()) / 2;
		thicknessTBRBarBorder = parseInt(TBRBars.first().css("border-bottom-width"));
		thicknessXAxisTick = parseInt(xTicks.first().css("border-right-width"));
		thicknessYAxisTick = parseInt(yTicks.first().css("border-bottom-width"));

		// BGs
		for (i = 0; i < BGDots.length; i++)	{
			// Actualize BG
			var BGDot = BGDots.eq(i);

			// Build BG
			buildElement(BGDot);
		}

		// TBRs
		for (i = 0; i < TBRBars.length - 1; i++) {
			// Actualize TBR
			var TBRBar = TBRBars.eq(i);

			// Build TBR
			buildElement(TBRBar);
		}
	}

	function buildElement(e) {
		// Get time
		var t0 = parseInt(e.attr("x"));
		var t1 = parseInt(e.next().attr("x"));

		if (e.hasClass("BG")) {
			// Get BG
			var BG = parseFloat(e.attr("y"));

			// Compute BG tick coordinates
			var x = (t0 - (x0 - dX)) / dX * graphBG.outerWidth() - radiusBGDot - thicknessXAxisTick / 2;
			var y = BG / yMax * graphBG.outerHeight() - radiusBGDot + thicknessYAxisTick / 2;

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
			var x = (t0 - (x0 - dX)) / dX * graphTBR.outerWidth();
			var y = 100 / yTBRMax * graphTBR.outerHeight() - thicknessTBRBarBorder / 2;
			var w = (t1 - t0) / dX * graphTBR.outerWidth();
			var h = Math.abs((TBR - 100) / yTBRMax * graphTBR.outerHeight());
			var prevH = Math.abs((prevTBR - 100) / yTBRMax * graphTBR.outerHeight());
			var nextH = Math.abs((nextTBR - 100) / yTBRMax * graphTBR.outerHeight());

			// For high TBR
			if (TBR > 100) {
				// Add class to TBR
				e.addClass("highTBR");

				// Push inner bars up
				e.children().css({
					"margin-bottom": "auto"
				});

				// Draw contour
				if (TBR > prevTBR) {
					e.children().first().css({
						"height": h - prevH,
						"border-right": "none"
					});
				}

				if (TBR > nextTBR) {
					e.children().last().css({
						"height": h - nextH,
						"border-left": "none"
					});
				}
			} 
			// For low TBR
			else if (TBR < 100) {
				// Add class to TBR
				e.addClass("lowTBR");

				// Push inner bars down
				e.children().css({
					"margin-top": "auto"
				});

				// Draw contour
				if (TBR < prevTBR) {
					e.children().first().css({
						"height": h - prevH,
						"border-right": "none"
					});
				}

				if (TBR < nextTBR) {
					e.children().last().css({
						"height": h - nextH,
						"border-left": "none"
					});
				}
			}
			// For no TBR
			else {
				// Add class to TBR
				e.addClass("noTBR");

				// Baseline should only be one line
				e.css({
					"border-top": "none"
				});

				// No side-borders needed on inner bars
				e.children().css({
					"border": "none"
				});
			}

			// TBR crosses baseline
			if (prevTBR < 100 && TBR > 100) {
				e.children().first().css({
					"height": h - thicknessTBRBarBorder,
				});

				e.prev().children().last().css({
					"height": prevH - thicknessTBRBarBorder,
				});
			} else if (nextTBR < 100 && TBR > 100) {
				e.children().last().css({
					"height": h - thicknessTBRBarBorder,
				});

				e.next().children().first().css({
					"height": nextH - thicknessTBRBarBorder,
				});
			}

			// Deal with minor TBRs
			if (h < 2 * thicknessTBRBarBorder) {
				h = thicknessTBRBarBorder;

				e.children().css({
					"border": "none"
				});

				if (TBR > 100) {
					e.css({
						"border-top": "none"
					});
				} else if (TBR < 100) {
					e.css({
						"border-bottom": "none"
					});
				}
			}

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
			// Get infos
			var TBR = roundTBR(e.attr("y"));

			// Add info to bubble
			bubbleInfo.html("<span class='TBR'>" + TBR + "</span>%");
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
		var TBR = roundTBR(TBRBars.eq(-1).attr("y"));

		// Add to dash
		dashTBR.text(TBR);
	}

	function toggleSettings () {
		if (settings.css("right") == "0px") {
			settings.animate({
				right: "-=" + widthSettings
			});
		} else {
			settings.animate({
				right: "+=" + widthSettings
			});
		}
	}

	function simulateBG () {
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

		for (i = 0; i < x.length; i++) {
			graphBG.append(ticks[i]);
		}
	}

	function simulateTBR () {
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
				ticks.last().append($("<div class='innerTBRBar'></div>"));
			}
		}

		for (i = 0; i < x.length; i++) {
			graphTBR.append(ticks[i]);
		}
	}



	// Main
	init();

	$(window).resize(function () {
		buildGraph();
	});

	settingsButton.on("click", function () {
		toggleSettings();
	});
});