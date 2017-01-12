$(document).ready(function()
{
	// Config
	var now = new Date();
	var x0 = now.getTime();
	var x = [];
	var x_ = [];
	var dx = 1; // Time step (h)
	var dX = 12; // Time range (h)
	var yBG = [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15]; // mmol/L
	var yBGMin = yBG.min();
	var yBGMax = yBG.max();
	var yTBR = [0, 100, 200]; // %
	var yTBRMin = yTBR.min();
	var yTBRMax = yTBR.max();
	var dy;
	var dYBG = yBGMax - yBGMin; // BG range (mmol/L)
	var dYTBR = yTBRMax - yTBRMin;
	var BGScale = [3, 4, 7, 12]; // (mmol/L)
	var dBGdtScale = [-0.15, -0.075, 0.075, 0.15]; // (mmol/L/m)

	// Elements
	var header = $("header");
	var loader = $("#loader");
	var graph = $("#graph");
	var graphBG = $("#graph-BG");
	var graphI = $("#graph-I");
	var xAxis = $("#graph-x-axis");
	var yAxisBG = $("#graph-y-axis-BG");
	var yAxisTBR = $("#graph-y-axis-I");
	var xTicks;
	var yTicks;
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
	var BGDots;
	var BDots;
	var TBRBars;
	
	// Sizes
	var radiusBGDot;
	var radiusBDot;
	var thicknessTBRBarBorder;
	var thicknessXAxisTick;
	var thicknessYAxisTick;

	// Variables
	var tick;

	// Functions
	function init() {
		buildXAxis();
		buildYAxis();
		simulateBG();
		simulateTBR();
		simulateBolus();
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
			x_.push(convertTime(x[i], "HH:MM"));
		}

		// Create X-Axis
		for (i = 0; i < x.length - 1; i++) {
			// Create tick
			tick = $("<div class='graph-x-axis-tick'>" + x_[i + 1] + "</div>");

			// Style tick
			tick.css({
				"width": ((x[i + 1] - x[i]) / dX * 100) + "%"
			});

			// Add tick to graph
			xAxis.append(tick);
		}
	}

	function buildYAxis () {
		// Create Y-Axis
		for (i = 0; i < yBG.length - 1; i++) {
			// Compute dy
			dy = yBG[i + 1] - yBG[i]; // BG step (mmol/L)

			// Create tick
			tick = $("<div class='graph-y-axis-tick'>" + yBG[i] + "</div>");

			// Style tick
			tick.css({
				"height": (dy / dYBG * 100) + "%"
			});

			// Add tick to DOM
			yAxisBG.append(tick);
		}

		for (i = 0; i < yTBR.length - 1; i++) {
			// Compute dy
			dy = yTBR[i + 1] - yTBR[i]; // TBR step (%)

			// Create tick
			tick = $("<div class='graph-y-axis-tick'>" + yTBR[i] + "</div>");

			// Style tick
			tick.css({
				"height": (dy / dYTBR * 100) + "%"
			});

			// Add tick to DOM
			yAxisTBR.append(tick);
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

		// Boluses
		for (i = 0; i < BDots.length; i++) {
			// Actualize bolus
			var BDot = BDots.eq(i);

			// Build bolus
			buildElement(BDot);
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
			var y = BG / yBGMax * graphBG.outerHeight() - radiusBGDot + thicknessYAxisTick / 2;

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
			var y = 100 / yTBRMax * graphI.outerHeight() - thicknessTBRBarBorder / 2;
			var w = (t1 - t0) / dX * graphI.outerWidth();
			var h = Math.abs((TBR - 100) / yTBRMax * graphI.outerHeight());
			var prevH = Math.abs((prevTBR - 100) / yTBRMax * graphI.outerHeight());
			var nextH = Math.abs((nextTBR - 100) / yTBRMax * graphI.outerHeight());

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

			// Minor TBRs
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
			var x = (t0 - (x0 - dX)) / dX * graphI.outerWidth() - radiusBDot - thicknessXAxisTick / 2;
			var y = 100 / yTBRMax * graphI.outerHeight() - radiusBDot + thicknessYAxisTick / 2;

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

		graphBG.append(ticks);
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

		graphI.append(ticks);
	}

	function simulateBolus () {
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

	function getBoluses () {
		// Create bolus object
		var boluses = {};

		// Turn off async AJAX
		$.ajaxSetup({
			async: false
		});

		// Get boluses with AJAX
		$.getJSON("ajax/insulin.json", function (data) {
			// Store boluses with epoch time
			$.each(data["Boluses"], function (key, value) {
				boluses[convertTime(key, "YYYY.MM.DD - HH:MM:SS")] = value;
			});
		});

		// Return boluses
		return boluses;
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