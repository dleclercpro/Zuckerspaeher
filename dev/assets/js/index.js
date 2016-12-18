$(document).ready(function()
{
	// Config
	var now = new Date();
	var then;
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
	var BGInfo = $("#bg-info");
	var BGInfoTime = $("#bg-time");
	var BGInfoValue = $("#bg-value");

	// Sizes
	var widthSettings = "25%";
	var radiusBGTick = 5;
	var thicknessXAxisTick = 2;
	var thicknessYAxisTick = 2;



	// Functions
	function init() {
		buildAxes();
		simulateData();
		showData();
	}

	function buildAxes () {
		// X-Axis
		buildXAxis();

		// Y-Axis
		buildYAxis();
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
			then = new Date(x[i]);

			x_.push(("0" + then.getHours()).slice(-2) + ":" + ("0" + then.getMinutes()).slice(-2));
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
		var B = 2;
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
		var BGTicks = $(".bg");
		var BGTick;
		var t;
		var BG;

		for (i = 0; i < BGTicks.length; i++)	{
			// Actualize BG
			BGTick = BGTicks.eq(i);

			// Get coordinates of BG
			t = BGTick.attr("x");
			BG = BGTick.attr("y");

			// Position BG on graph
			BGTick.css({
				// ... on X-Axis
				"left": ((t - (x_0 - dX)) / dX * graphData.width() - radiusBGTick - thicknessXAxisTick / 2) + "px",

				// ... on Y-Axis
				"bottom": (BG / y.max() * graphData.height() - radiusBGTick - thicknessYAxisTick / 2) + "px"
			});

			// Color BG
			if (BG < BGScale[0]) {
				BGTick.addClass("bg-very-low");
			} else if (BG >= BGScale[0] && BG < BGScale[1]) {
				BGTick.addClass("bg-low");
			} else if (BG >= BGScale[1] && BG < BGScale[2]) {
				BGTick.addClass("bg-normal");
			} else if (BG >= BGScale[2] && BG < BGScale[3]) {
				BGTick.addClass("bg-high");
			} else if (BG >= BGScale[3]) {
				BGTick.addClass("bg-very-high");
			}

			BGTick.on("mouseenter", function () {
				t = new Date(parseInt($(this).attr("x")));
				t = ("0" + t.getHours()).slice(-2) + ":" + ("0" + t.getMinutes()).slice(-2);
				BG = Math.round($(this).attr("y") * 10) / 10;
				BGInfo.css({
					"left": (($(this).attr("x") - (x_0 - dX)) / dX * graphData.width() - radiusBGTick - thicknessXAxisTick / 2) + 10 + "px",
					"bottom": ($(this).attr("y") / y.max() * graphData.height() - radiusBGTick - thicknessYAxisTick / 2) + 10 + "px"
				});
				BGInfoValue.text("BG: " + BG + " mmol/L");
				BGInfoTime.text("Time: " + t);
				BGInfo.show();
			});

			BGTick.on("mouseleave", function () {
				BGInfo.hide();
			});
		}
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