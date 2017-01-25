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