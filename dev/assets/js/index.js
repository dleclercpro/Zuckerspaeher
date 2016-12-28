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
	var dx = 1; // Time step (h)
	var dX = 12; // Time range (h)
	var dy = 0; // BG step (mmol/L)
	var dY = yMax - yMin; // BG range (mmol/L)
	var xTicks = [];
	var yTicks = [];
	var BGScale = [3, 4, 7, 12]; // (mmol/L)
	var dBGdtScale = [-0.5, -0.25, 0.25, 0.5]; // (mmol/L/m)

	// Elements
	var loader = $("#loader");
	var graph = $("#graph-inner");
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
	var YAxis = $("#graph-y-axis");	
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
		for (i = 0; i < y.length - 1; i++)	{
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
	}

	function buildGraph () {
		BGDots = $("#graph-inner > .BG");
		TBRBars = $("#graph-inner > .TBR");
		radiusBGDot = parseInt(BGDots.first().outerWidth()) / 2;
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
		var t0 = e.attr("x");

		if (e.hasClass("BG")) {
			// Get BG
			var BG = e.attr("y");

			// Compute BG tick coordinates
			var x = (t0 - (x0 - dX)) / dX * graph.outerWidth() - radiusBGDot - thicknessXAxisTick / 2;
			var y = BG / yMax * graph.outerHeight() - radiusBGDot + thicknessYAxisTick / 2;

			// Color BG tick
			e.addClass(rankBG(BG, BGScale));

			// Position BG on graph
			e.css({
				"left": x + "px",
				"bottom": y + "px"
			});
		} else if (e.hasClass("TBR")) {
			// Get next time
			var t1 = e.next().attr("x");

			// Get TBR
			var TBR = e.attr("y");

			// Compute TBR bar coordinates
			var x = (t0 - (x0 - dX)) / dX * graph.outerWidth();
			var y = 1 / yMax * graph.outerHeight();
			var w = (t1 - t0) / dX * graph.outerWidth();
			var h = TBR / 2 / yMax * graph.outerHeight();

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
		var x = parseFloat(e.css("left")) + 10;
		var y = parseFloat(e.css("bottom")) + 10;

		// Position bubble on graph
		bubble.css({
			"left": x + "px",
			"bottom": y + "px"
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
				"bottom": y - 1.5 * 10 - bubble.outerHeight() + "px"
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
		var dt = (BGDots.eq(-1).attr("x") - BGDots.eq(-2).attr("x")) / 1000 / 60; // (m)
		var dBGdt = roundBG(dBG / dt);

		// Add to dash
		dashdBGdt.text(dBGdt);

		// Select arrow and add it to dash
		dashArrow.text(rankdBGdt(dBGdt, dBGdtScale));

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
			ticks.push($("<div class='BG' x='" + x[i] + "' y='" + y[i] + "'></div>"));
		}

		for (i = 0; i < x.length; i++) {
			graph.append(ticks[i]);
		}
	}

	function simulateTBR () {
		var x = [];
		var y = [];
		var dx = 5 * 60 * 1000; // ms
		var dX = 12 * 60 * 60 * 1000; // ms
		var u = 0;
		var u_0 = 15;
		var A = 3.5;
		var B = 0;
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
			ticks.push($("<div class='TBR' x='" + x[i] + "' y='" + y[i] + "'></div>"));
		}

		for (i = 0; i < x.length; i++) {
			graph.append(ticks[i]);
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