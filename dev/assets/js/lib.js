/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

 Title:    lib.js

 Author:   David Leclerc

 Version:  0.1

 Date:     08.08.2017

 License:  GNU General Public License, Version 3
           (http://www.gnu.org/licenses/gpl.html)

 Overview: ...

 Notes:    ...

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

export const last = (array, n = 1) => {

    // If empty
    if (array.length < n) {

        // Return nothing
        return null;
    }
    // Otherwise
    else {

        // Return last value
        return array[array.length - n];

    }
};

export const arrayize = (x) => {

    // Initialize response
    let X = x;

    // If not an array
    if (!(x instanceof Array)) {

        // Convert to array
        X = [x];
    }

    // Return resposne
    return X;
};

export const round = (x, n = 1) => {

    // Ensure float
    x = parseFloat(x);

    // Define scientific exponent
    const e = Math.pow(10, n);

    // Return rounded value
    return (Math.round(x * e) / e).toFixed(n);
};

export const formatTime = (T, format) => {

    // Make sure an array was given as input
    T = arrayize(T);

    // Initialize converted time array
    let T_ = [];

    // Define 01.01.2000 - 00:00:00 in epoch time (ms)
    const epoch = 946684800000;

    // Loop on time entries
    for (let t of T) {

        // Initialize converted time
        let t_ = null;

        // If epoch time (bigger than
        if (parseInt(t) > epoch) {

            // Parse string
            t = parseInt(t);

            // Generate date object
            const date = new Date(t);

            // Read date components
            const year = date.getFullYear(),
                  month = date.getMonth() + 1,
                  day = date.getDate(),
                  hour = date.getHours(),
                  minute = date.getMinutes(),
                  second = date.getSeconds();

            // Look for correct format
            switch(format) {

                // Format 1
                case "YYYY.MM.DD - HH:MM:SS":

                    // Store conversion
                    t_ = year + "." +
                         ("0" + month).slice(-2) + "." +
                         ("0" + day).slice(-2) + " - " +
                         ("0" + hour).slice(-2) + ":" +
                         ("0" + minute).slice(-2) + ":" +
                         ("0" + second).slice(-2);

                    break;

                // Format 2
                case "HH:MM - DD.MM.YYYY":

                    // Store conversion
                    t_ = ("0" + hour).slice(-2) + ":" +
                         ("0" + minute).slice(-2) + " - " +
                         ("0" + day).slice(-2) + "." +
                         ("0" + month).slice(-2) + "." +
                         year;

                    break;

                // Format 3
                case "HH:MM":

                    // Store conversion
                    t_ = ("0" + hour).slice(-2) + ":" +
                         ("0" + minute).slice(-2);

                    break;

                // Error
                default:

                    // Show error
                    console.log("Time conversion error: " + T);
            }
        }

        // If date object
        else if (t instanceof Date) {

        }

        // If formatted string
        else if (typeof(t) == "string") {

            // Initialize date components
            let year = null,
                month = null,
                day = null,
                hour = null,
                minute = null,
                second = null;

            // Look for correct format
            switch(format) {

                // Format 1
                case "YYYY.MM.DD - HH:MM:SS":

                    // Parse time
                    year = t.slice(0, 4);
                    month = t.slice(5, 7);
                    day = t.slice(8, 10);
                    hour = t.slice(-8, -6);
                    minute = t.slice(-5, -3);
                    second = t.slice(-2);

                    break;

                // Format 2
                case "HH:MM - DD.MM.YYYY":

                    // Parse time
                    year = t.slice(-4);
                    month = t.slice(-7, -5);
                    day = t.slice(-10, -8);
                    hour = t.slice(0, 2);
                    minute = t.slice(3, 5);
                    second = 0;

                    break;

                // Format 3 (map time)
                case "HH:MM":

                    // Generate new dates for considered time, today and yesterday
                    const now = new Date();
                    const today = new Date();
                    const yesterday = new Date();

                    // Set yesterday
                    yesterday.setDate(now.getDate() - 1);

                    // Read time
                    hour = t.slice(0, 2);
                    minute = t.slice(3, 5);
                    second = 0;

                    // Define considered time
                    now.setHours(hour);
                    now.setMinutes(minute);
                    now.setSeconds(second);

                    // If later than current time
                    if (now > today) {

                        // Define date
                        year = yesterday.getFullYear();
                        month = yesterday.getMonth() + 1;
                        day = yesterday.getDate();
                    }
                    // Otherwise
                    else {

                        // Define date
                        year = today.getFullYear();
                        month = today.getMonth() + 1;
                        day = today.getDate();
                    }

                    break;

                    // Error
                    default:

                        // Show error
                        console.log("Time conversion error: " + T);
            }

            // Generate new date object
            const date = new Date();

            // Define date
            date.setFullYear(year);
            date.setMonth(month - 1);
            date.setDate(day);
            date.setHours(hour);
            date.setMinutes(minute);
            date.setSeconds(second);

            // Convert time
            t_ = date.getTime();
        }

        // Unknown format
        else {

            // Show error
            console.log("Time conversion error: " + T);
        }

        // Store time conversion
        T_.push(t_);
    }

    // Return array
    if (T_.length > 1) {
        return T_;
    }

    // Return single value
    else {
        return T_[0];
    }
};

export const indexSort = (x, ...args) => {

    // Count number of entries in main array
    const N = x.length;

    // Count number of arrays to sort according to main array
    const n = args.length;

    // Loop on all values
    for (let i = 0; i < N; i++) {

        // Couple indexes with values
        x[i] = [x[i], i];
    }

    // Sort based on values
    x.sort((a, b) => {
        return a[0] < b[0] ? -1 : 1;
    });

    // Initialize indexes array
    let indexes = [];

    // Loop on all values
    for (let i = 0; i < N; i++) {

        // Decouple indexes and values
        [x[i], indexes[i]] = x[i];
    }

    // Initialize sorted rest array
    let sorted = [];

    // Sort linked arrays based on previously obtained indexes array
    for (let i = 0; i < n; i++) {

        // Initialize sorted array
        sorted[i] = [];

        // Loop on sorted indexes
        for (let j = 0; j < N; j++) {

            // Sort according to index
            sorted[i][j] = args[i][indexes[j]];
        }
    }

    // Return modified arrays
    return [x, ...sorted]
};

export const getData = (report, branch = null, format = "YYYY.MM.DD - HH:MM:SS") => {

    // Initialize data arrays
    let x = [],
        y = [];

    // Turn off async AJAX
    $.ajaxSetup({
        async: false
    });

    // Read report with AJAX
    $.getJSON(report, (data) => {

        // Get data from particular report branch if desired
        if (branch != null) {
            data = data[branch];
        }

        // Store data
        $.each(data, (key, value) => {
            x.push(key);
            y.push(value);
        });
    });

    // Turn on async AJAX
    $.ajaxSetup({
        async: true
    });

    // Format x-axis if desired
    if (format != null) {

        // Format
        x = formatTime(x, format);
    }

    // Sort data
    [x, y] = indexSort(...[x, y]);

    // Return data
    return [x, y];
};

export const decodeHTMLEntity = (str) => {
    return $("<textarea>").html(str).text();
};

export const rankBG = (BG, BGScale) => {

    // Make sure BG is a float
    BG = parseFloat(BG);

    // Rank it
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
};

export const rankdBGdt = (dBGdt, dBGdtScale) => {

    // Make sure dBGdt is a float
    dBGdt = parseFloat(dBGdt);

    // Define arrows
    const arrowUp = decodeHTMLEntity("&#8593;");
    const arrowRightUp = decodeHTMLEntity("&#8599;");
    const arrowRight = decodeHTMLEntity("&#8594;");
    const arrowRightDown = decodeHTMLEntity("&#8600");
    const arrowDown = decodeHTMLEntity("&#8595;");

    // Rank it and return corresponding arrow
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
};