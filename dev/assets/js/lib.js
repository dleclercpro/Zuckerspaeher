function decodeEntity(str) {
    return $("<textarea>").html(str).text();
}

function range(start, stop, step) {
    if (typeof stop == 'undefined') {
        stop = start;
        start = 0;
    }

    if (typeof step == 'undefined') {
        step = 1;
    }

    if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
        return [];
    }

    var result = [];
    for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
        result.push(i);
    }

    return result;
}

function indexSort(x, y = []) {
    // Couple indexes with values
  for (i = 0; i < x.length; i++) {
    x[i] = [x[i], i];
  }

  // Sort based on values
  x.sort(function(a, b) {
    return a[0] < b[0] ? -1 : 1;
  });

  // Initialize indexes array
  indexes = [];

  // Decouple indexes and values
  for (i = 0; i < x.length; i++) {
    indexes.push(x[i][1]);
    x[i] = x[i][0];
  }

  // Sort linked arrays based on previously obtained indexes array
  var z = [];

  for(i = 0; i < y.length; i++) {
    z[i] = [];

    for(j = 0; j < x.length; j++) {
        z[i][j] = y[i][indexes[j]];
    }

    // Reassign sorted values to original arrays
    y[i] = z[i];
  }
}

function getData(report, reportSection, format = false, limits = []) {
    // Create data arrays
    var x = [];
    var y = [];

    // Turn off async AJAX
    $.ajaxSetup({
        async: false
    });

    // Read report with AJAX
    $.getJSON(report, function (data) {
        // Get data from particular report section if desired
        if (reportSection) {
            data = data[reportSection];
        }

        // Store data
        $.each(data, function (key, value) {
            x.push(key);
            y.push(value);
        });
    });

    // Turn on async AJAX
    $.ajaxSetup({
        async: true
    });

    // Format x-axis if desired
    if(format) {
        x = convertTime(x, format);
    }

    // Initialize final arrays
    var X = [];
    var Y = [];

    // Exclude data out of limits
    if (limits.length != 0) {
        for (i = 0; i < x.length; i++) {
            if (x[i] >= limits[0] && x[i] <= limits[1]) {
                X.push(x[i]);
                Y.push(y[i]);
            }
        }
    }

    // Return data
    return [X, Y];
}

function convertTime(t, format) {
    // Identify type of input given
    var isArray = true;

    if (typeof(t) === "number" || typeof(t) === "string") {
        isArray = false;

        // Convert input to array
        t = [t];
    }

    // Initialize result variable
    var result = [];

    // Loop on input
    for(i = 0; i < t.length; i++) {
        // Convert from epoch to string
        if(parseInt(t[0]) == t[0]) {
            t[i] = parseInt(t[i]);

            var date = new Date(t[i]);

            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var hour = date.getHours();
            var minute = date.getMinutes();
            var second = date.getSeconds();
            var millisecond = date.getMilliseconds(0);

            // Store time conversion
            switch(format) {
                case "YYYY.MM.DD - HH:MM:SS":
                    result.push(year + "." +
                        ("0" + month).slice(-2) + "." +
                        ("0" + day).slice(-2) + " - " +
                        ("0" + hour).slice(-2) + ":" +
                        ("0" + minute).slice(-2) + ":" +
                        ("0" + second).slice(-2)
                    );
                    break;

                case "HH:MM - DD.MM.YYYY":
                    result.push(("0" + hour).slice(-2) + ":" +
                        ("0" + minute).slice(-2) + " - " +
                        ("0" + day).slice(-2) + "." +
                        ("0" + month).slice(-2) + "." +
                        year
                    );
                    break;

                case "HH:MM":
                    result.push(("0" + hour).slice(-2) + ":" +
                        ("0" + minute).slice(-2)
                    );
                    break;

                default:
                    alert("Time conversion error.");
            }
        }

        // Convert from string to epoch
        else {
            var date = new Date();

            switch(format) {
                case "YYYY.MM.DD - HH:MM:SS":
                    var year = t[i].slice(0, 4);
                    var month = t[i].slice(5, 7);
                    var day = t[i].slice(8, 10);
                    var hour = t[i].slice(-8, -6);
                    var minute = t[i].slice(-5, -3);
                    var second = t[i].slice(-2);
                    var millisecond = 0;
                    break;

                case "HH:MM - DD.MM.YYYY":
                    var year = t[i].slice(-4);
                    var month = t[i].slice(-7, -5);
                    var day = t[i].slice(-10, -8);
                    var hour = t[i].slice(0, 2);
                    var minute = t[i].slice(3, 5);
                    var second = 0;
                    var millisecond = 0;
                    break;

                default:
                    alert("Time conversion error.");
            }

            date.setFullYear(year);
            date.setMonth(month - 1);
            date.setDate(day);
            date.setHours(hour);
            date.setMinutes(minute);
            date.setSeconds(second);
            date.setMilliseconds(millisecond);

            // Store time conversion
            result.push(date.getTime());
        }
    }

    // Give back result based on input type
    if (isArray) {
        return result;
    }

    return result[0];
}

function rankBG(BG, BGScale) {
    BG = parseFloat(BG);

    if (BG < BGScale[0]) {
        return "BG-very-low";
    } else if (BG >= BGScale[0] && BG < BGScale[1]) {
        return "BG-low";
    } else if (BG >= BGScale[1] && BG < BGScale[2]) {
        return "BG-normal";
    } else if (BG >= BGScale[2] && BG < BGScale[3]) {
        return "BG-high";
    } else if (BG >= BGScale[3]) {
        return "BG-very-high";
    }
}

function rankdBGdt(dBGdt, dBGdtScale) {
    dBGdt = parseFloat(dBGdt);
    
    var arrowUp = decodeEntity("&#8593;");
    var arrowRightUp = decodeEntity("&#8599;");
    var arrowRight = decodeEntity("&#8594;");
    var arrowRightDown = decodeEntity("&#8600");
    var arrowDown = decodeEntity("&#8595;");

    if (dBGdt < dBGdtScale[0]) {
        return arrowDown;
    } else if (dBGdt >= dBGdtScale[0]  && dBGdt < dBGdtScale[1]) {
        return arrowRightDown;
    } else if (dBGdt >= dBGdtScale[1] && dBGdt < dBGdtScale[2]) {
        return arrowRight;
    } else if (dBGdt >= dBGdtScale[2] && dBGdt < dBGdtScale[3]) {
        return arrowRightUp;
    } else if (dBGdt >= dBGdtScale[3]) {
        return arrowUp;
    }
}

function roundBG(BG) {
    BG = parseFloat(BG);

    return (Math.round(BG * 10) / 10).toFixed(1);
}

function roundTBR(TBR) {
    TBR = parseInt(TBR);

    return Math.round(TBR).toFixed(0);
}

function roundB(B) {
    B = parseInt(B);

    return (Math.round(B * 10) / 10).toFixed(1);
}