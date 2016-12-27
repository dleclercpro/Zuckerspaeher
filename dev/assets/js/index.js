$(document).ready(function()
{
	// Config
	var now = new Date();
	var x = [];
	var x_ = [];
	var x_0 = now.getTime();
	var y = [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15]; // mmol/L
	var dx = 1; // Time step (h)
	var dX = 12; // Time range (h)
	var dy = 0; // BG step (mmol/L)
	var dY = y.max() - y.min(); // BG range (mmol/L)
	var xTicks = [];
	var yTicks = [];
	var BGScale = [3, 4, 7, 12];

	// Elements
	var loader = $("#loader");
	var graph = $("#graph-data");
	var graphXAxis = $("#graph-x-axis");
	var graphYAxis = $("#graph-y-axis");	
	var settings = $("#settings");
	var settingsButton = $("#settings-button");
	var bubbleBG = $("#bg-info");
	var bubbleBGTime = $("#bg-time");
	var bubbleBGLabel = $("#bg-number");
	var bubbleTBR = $("#tbr-info");
	var bubbleTBRTime = $("#tbr-time");
	var bubbleTBRLabel = $("#tbr-number");
	
	// Sizes
	var widthSettings = "25%";



	// Functions
	function init() {
		buildXAxis();
		buildYAxis();
		simulateBG();
		simulateTBR();
		showData();
	}

	function buildXAxis () {
		dx = dx * 60 * 60 * 1000; // Time step (ms)
		dX = dX * 60 * 60 * 1000; // Time range (ms)

		// Create epoch time scale
		for (i = 0; i < (dX / dx); i++) {
			x.unshift(x_0 - i * dx);
		}

		x.unshift(x_0 - dX);

		// Format epoch to string
		for (i = 0; i < x.length; i++) {
			x_.push(convertTime(x[i], "HH:MM"));
		}

		// Create time axis
		for (i = 0; i < x.length - 1; i++) {
			// Create tick
			xTicks.push($("<div class='graph-x-axis-tick'>" + x_[i + 1] + "</div>"));

			// Style tick
			xTicks[i].css({
				"width": ((x[i + 1] - x[i]) / dX * 100) + "%"
			});

			// Add tick to graph
			graphXAxis.append(xTicks[i]);
		}
	}

	function buildYAxis () {
		y = y.reverse();

		for (i = 0; i < y.length - 1; i++)	{
			// Compute dy
			dy = y[i] - y[i + 1];

			// Create tick
			yTicks.push($("<div class='graph-y-axis-tick'>" + y[i + 1] + "</div>"));

			// Style tick
			yTicks[i].css({
				"height": (dy / dY * 100) + "%"
			});

			// Add tick to DOM
			graphYAxis.append(yTicks[i]);
		}
	}

	function showData () {
		var t;
		var BG;
		var xBG;
		var yBG;
		var BGDot;
		var BGDots = $(".bg");
		var TBRBar;
		var TBRBars = $(".tbr");
		var xBubble;
		var yBubble;
		var radiusBGDot = parseInt(BGDots.first().outerWidth()) / 2;
		var thicknessXAxisTick = parseInt(xTicks.first().css("border-right-width"));
		var thicknessYAxisTick = parseInt(yTicks.first().css("border-bottom-width"));

		// BGs
		for (i = 0; i < BGDots.length; i++)	{
			// Actualize BG
			BGDot = BGDots.eq(i);

			// Get BG infos
			t = BGDot.attr("x");
			BG = BGDot.attr("y");

			// Compute BG tick coordinates
			xBG = (t - (x_0 - dX)) / dX * graph.outerWidth() - radiusBGDot - thicknessXAxisTick / 2;
			yBG = BG / y.max() * graph.outerHeight() - radiusBGDot + thicknessYAxisTick / 2;

			// Position BG on graph
			BGDot.css({
				"left": xBG + "px",
				"bottom": yBG + "px"
			});

			// Color BG tick
			BGDot.addClass(rankBG(BG, BGScale));

			// Show bubble
			BGDot.on("mouseenter", function () {
				showBubbleBG($(this));
			});

			// Hide bubble
			BGDot.on("mouseleave", function () {
				bubbleBG.hide();
			});
		}

		// TBRs
		for (i = 0; i < TBRBars.length - 1; i++) {
			// Actualize TBR
			TBRBar = TBRBars.eq(i);
			TBRBarNext = TBRBars.eq(i + 1);

			// Get TBR infos
			t = TBRBar.attr("x");
			tNext = TBRBarNext.attr("x");
			TBR = TBRBar.attr("y");

			// Compute TBR bar coordinates
			xTBR = (t - (x_0 - dX)) / dX * graph.outerWidth();
			yTBR = 1 / y.max() * graph.outerHeight();
			wTBR = (tNext - t) / dX * graph.outerWidth();
			hTBR = TBR / 2 / y.max() * graph.outerHeight();

			// Position TBR on graph
			TBRBar.css({
				"left": xTBR + "px",
				"bottom": yTBR + "px",
				"width": wTBR + "px",
				"height": hTBR + "px"
			});

			// Show bubble
			TBRBar.on("mouseenter", function () {
				showBubbleTBR($(this));
			});

			// Hide bubble
			TBRBar.on("mouseleave", function () {
				bubbleTBR.hide();
			});
		}
	}

	function showBubbleBG (BGDot) {
		// Get BG and time
		t = convertTime(BGDot.attr("x"), "HH:MM - DD.MM.YYYY");
		BG = (Math.round(BGDot.attr("y") * 10) / 10).toFixed(1);

		// Add BG
		bubbleBGLabel.text(BG);

		// Color BG
		bubbleBGLabel.removeClass();
		bubbleBGLabel.addClass(rankBG(BG, BGScale));

		// Add time
		bubbleBGTime.text(t);

		// Position bubble on graph
		xBubble = parseFloat(BGDot.css("left")) + 10;
		yBubble = parseFloat(BGDot.css("bottom")) + 10;

		// If bubble exceeds width of graph
		if (xBubble + bubbleBG.outerWidth() > graph.outerWidth()) {
			bubbleBG.css({
				"left": xBubble - 1.5 * 10 - bubbleBG.outerWidth() + "px"
			});
		} else {
			bubbleBG.css({
				"left": xBubble + "px"
			});
		}

		// If bubble exceeds height of graph
		if (yBubble + bubbleBG.outerHeight() > graph.outerHeight()) {
			bubbleBG.css({
				"bottom": yBubble - 1.5 * 10 - bubbleBG.outerHeight() + "px"
			});
		} else {
			bubbleBG.css({
				"bottom": yBubble + "px"
			});
		}

		// Show bubble
		bubbleBG.show();
	}

	function showBubbleTBR (TBRBar) {
		// Get TBR and time
		t = convertTime(TBRBar.attr("x"), "HH:MM - DD.MM.YYYY");
		TBR = (Math.round(TBRBar.attr("y") * 100)).toFixed(0);

		// Add TBR
		bubbleTBRLabel.text(TBR);

		// Add time
		bubbleTBRTime.text(t);

		// Position bubble on graph
		xBubble = parseFloat(TBRBar.css("left")) + 10;
		yBubble = parseFloat(TBRBar.css("bottom")) + 10;

		// If bubble exceeds width of graph
		if (xBubble + bubbleTBR.outerWidth() > graph.outerWidth()) {
			bubbleTBR.css({
				"left": xBubble - 1.5 * 10 - bubbleTBR.outerWidth() + "px"
			});
		} else {
			bubbleTBR.css({
				"left": xBubble + "px"
			});
		}

		// If bubble exceeds height of graph
		if (yBubble + bubbleTBR.outerHeight() > graph.outerHeight()) {
			bubbleTBR.css({
				"bottom": yBubble - 1.5 * 10 - bubbleTBR.outerHeight() + "px"
			});
		} else {
			bubbleTBR.css({
				"bottom": yBubble + "px"
			});
		}

		// Show bubble
		bubbleTBR.show();
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
		//var x_0 = 1482080888 * 1000;
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
			x.unshift(x_0 - i * dx);
		}

		x.unshift(x_0 - dX);

		for (i = 0; i < x.length; i++) {
			u = (x[i] - (x_0 - dX)) / 1000000;

			if (u >= u_0) {
				y.push(A * Math.pow((u - u_0), k) * Math.exp(-(u - u_0)) + B);
			} else {
				y.push(B);
			}
		}

		for (i = 0; i < x.length; i++) {
			ticks.push($("<div class='bg' x='" + x[i] + "' y='" + y[i] + "'></div>"));
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
			x.unshift(x_0 - i * dx);
		}

		x.unshift(x_0 - dX);

		for (i = 0; i < x.length; i++) {
			u = (x[i] - (x_0 - dX)) / 1000000;

			if (u >= u_0) {
				y.push(A * Math.pow((u - u_0), k) * Math.exp(-(u - u_0)) + B);
			} else {
				y.push(B);
			}
		}

		for (i = 0; i < x.length; i++) {
			ticks.push($("<div class='tbr' x='" + x[i] + "' y='" + y[i] + "'></div>"));
		}

		for (i = 0; i < x.length; i++) {
			graph.append(ticks[i]);
		}
	}



	// Main
	init();

	$(window).resize(function () {
		showData();
	});

	settingsButton.on("click", function () {
		toggleSettings();
	});

});