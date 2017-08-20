/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

 Title:    lib.js

 Author:   David Leclerc

 Version:  0.1

 Date:     08.08.2017

 License:  GNU General Public License, Version 3
 (http://www.gnu.org/licenses/gpl.html)

 Overview: ...

 Notes:    ...

 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

// Imports
import jQuery from "jquery";

// Enable jQuery
window.$ = window.jQuery = jQuery;

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 LAST
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
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

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 FILTERSTRING
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
export const filterString = (string, x) => {

    // Get undesirable term length
    const n = x.length;

    // Split string, ignore elements starting with undesirable term, join result
    const result = $.grep(string.split(" "), (value, i) => {
        return !(value.length >= n && value.substring(0, n) == x);
    }).join(" ");

    // Return filtered string
    return result;
};

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ARRAYIZE
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
export const arrayize = (x) => {

    // Initialize response
    let X = x;

    // If not an array
    if (!(x instanceof Array)) {

        // Convert to array
        X = [x];
    }

    // Return response
    return X;
};

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 MIRROR
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
export const mirror = (x, zero = false) => {

    // Initialize mirrored array
    let X = [];

    // Add negative part
    X.push.apply(X, x.map(i => -i));

    // Reverse it
    X.reverse();

    // If zero wanted
    if (zero) {

        // Add zero
        X.push(0);
    }

    // Add positive part
    X.push.apply(X, x);

    // Return mirrored array
    return X;
};

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ROUND
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
export const round = (x, n = 0) => {

    // Ensure float
    x = parseFloat(x);

    // Define scientific exponent
    const e = Math.pow(10, n);

    // Return rounded value
    return Math.round(x * e) / e;
};

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 MAPTIME
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
export const mapTime = (t) => {

    // Initialize date components
    let year, month, day, hour, minute, second;

    // Generate new dates for considered time, today and yesterday
    const now = new Date(),
        today = new Date(),
        yesterday = new Date(now.getDate() - 1);

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

    // Define new date object
    const date = new Date(year, month - 1, day, hour, minute, second);

    // Return mapped time in epoch format (ms)
    return date.getTime();
};

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 FORMATTIME
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
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
            switch (format) {

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
                    console.error("Time conversion error: " + T);
            }
        }

        // If date object
        else if (t instanceof Date) {

            // Show error
            console.error("No implementation yet for conversion of: " + T);
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
            switch (format) {

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

                    // Map time
                    t_ = mapTime(t);

                    break;

                // Error
                default:

                    // Show error
                    console.error("Time conversion error: " + T);
            }

            // If time was not already converted to epoch
            if (t_ == null) {

                // Define new date object
                const date = new Date(year, month - 1, day, hour, minute, second);

                // Convert to epoch format (ms)
                t_ = date.getTime();
            }
        }

        // Unknown format
        else {

            // Show error
            console.error("Time conversion error: " + T);
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

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 INDEXSORT
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
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

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 GETDATA
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
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

            // Dig in data
            for (let b of branch) {

                // Get new section
                data = data[b];
            }
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

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 RANK
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
export const rank = (x, scale) => {

    // Make sure value is a float
    x = parseFloat(x);

    // Get limits and ranks
    const limits = scale.limits,
        ranks = scale.ranks;

    // Count number of limits in scale
    const n = limits.length;

    // Initialize rank
    let rank;

    // Get it
    for (let i = 0; i < n; i++) {

        // Check if under limit
        if (x <= limits[i]) {

            // Assign rank
            rank = ranks[i];

            // Exit
            break;
        }
        // If last, check if over limit
        else if (i == n - 1 && x > limits[i]) {

            // Assign rank
            rank = ranks[i + 1];
        }
    }

    // Return rank
    return rank;
};

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 DECODEHTMLUNICODE
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
export const decodeHTMLUnicode = (x) => {
    return $("<textarea>").html(x).text();
};

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 UPDATE
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
export const update = (element, data, precision = null, age = null, scale = null, value = null) => {

    // Get current epoch time
    const now = new Date().getTime();

    // Destructure data
    const [ t, y ] = data;

    // If data is still valid
    if (age != null && now - last(t) <= age * 60 * 1000 || age == null) {

        // If no value given
        if (value == null) {

            // Get last one
            value = last(y);
        }

        // If scale given
        if (scale != null) {

            // Rank value
            element.addClass(rank(value, scale));
        }

        // If number
        if (precision != null && typeof(value) == "number") {

            // Round it
            value = round(value, precision).toFixed(precision);
        }

        // Update element
        element.find(".value").text(value);
    }
}