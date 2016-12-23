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
	var dy = 0;
	var dY = y.max() - y.min();
	var xTicks = [];
	var yTicks = [];
	var BGScale = [3, 4, 7, 12];

	// Elements
	var graphData = $("#graph-data");
	var graphXAxis = $("#graph-x-axis");
	var graphYAxis = $("#graph-y-axis");	
	var settings = $("#settings");
	var settingsButton = $("#settings-button");
	var bubble = $("#bg-info");
	var bubbleTime = $("#bg-time");
	var infoBGValue = $("#bg-value");
	var bubbleBG = $("#bg-number");

	// Sizes
	var widthSettings = "25%";



	// Functions
	function init() {
		buildXAxis();
		buildYAxis();
		simulateData();
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

	function simulateData () {
		var ticks = [];
		//var x_0 = 1482080888 * 1000;
		var x = [];
		var y = [];
		var dx = 3 * 60 * 1000; // ms
		var dX = 12 * 60 * 60 * 1000; // ms
		var u = 0;
		var u_0 = 15;
		var A = 20;
		var B = 1;
		var k = 2;

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
			graphData.append(ticks[i]);
		}
	}

	function showData () {
		var t;
		var BG;
		var xBG;
		var yBG;
		var BGDot;
		var BGDots = $(".bg");
		var xBubble;
		var yBubble;
		var radiusBGDot = parseInt(BGDots.first().outerWidth()) / 2;
		var thicknessXAxisTick = parseInt(xTicks.first().css("border-right-width"));
		var thicknessYAxisTick = parseInt(yTicks.first().css("border-bottom-width"));

		for (i = 0; i < BGDots.length; i++)	{
			// Actualize BG
			BGDot = BGDots.eq(i);

			// Get BG infos
			t = BGDot.attr("x");
			BG = BGDot.attr("y");

			// Get BG tick coordinates
			xBG = (t - (x_0 - dX)) / dX * graphData.outerWidth() - radiusBGDot - thicknessXAxisTick / 2;
			yBG = BG / y.max() * graphData.height() - radiusBGDot + thicknessYAxisTick / 2;

			// Position BG on graph
			BGDot.css({
				"left": xBG + "px",
				"bottom": yBG + "px"
			});

			// Color BG tick
			BGDot.addClass(rankBG(BG, BGScale));

			// Show bubble
			BGDot.on("mouseenter", function () {
				showBubble($(this));
			});

			// Hide bubble
			BGDot.on("mouseleave", function () {
				bubble.hide();
			});
		}
	}

	function showBubble (BGDot) {
		// Get BG and time
		t = convertTime(BGDot.attr("x"), "HH:MM - DD.MM.YYYY");
		BG = (Math.round(BGDot.attr("y") * 10) / 10).toFixed(1);

		// Add BG
		bubbleBG.text(BG);

		// Color BG
		bubbleBG.removeClass();
		bubbleBG.addClass(rankBG(BG, BGScale));

		// Add time
		bubbleTime.text(t);

		// Position bubble on graph
		xBubble = parseFloat(BGDot.css("left")) + 10;
		yBubble = parseFloat(BGDot.css("bottom")) + 10;

		if (xBubble + bubble.outerWidth() > graphData.outerWidth()) {
			bubble.css({
				"left": xBubble - 1.5 * 10 - bubble.outerWidth() + "px",
				"bottom": yBubble + "px"
			});
		} else {
			bubble.css({
				"left": xBubble + "px",
				"bottom": yBubble + "px"
			});
		}

		// Show bubble
		bubble.show();
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



	// Main
	init();

	$(window).resize(function () {
		showData();
	});

	settingsButton.on("click", function () {
		toggleSettings();
	});

});