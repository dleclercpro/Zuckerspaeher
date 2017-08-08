M.Bubble = function Bubble () {

    /**
     * init
     * @param e
     * @param units
     * @param round
     * @param format
     */
    this.init = function (e, units, round, format = "HH:MM - DD.MM.YYYY") {

        // Store element on which bubble will give infos
        this.e = e;

        // Store element units
        this.units = units;

        // Store rounding position
        this.round = round;

        // Store time format
        this.format = format;

        // Get bubble element
        this.get();

        // Update bubble
        this.update();
    };

    /**
     * get
     */
    this.get = function () {

        // Get bubble
        var bubble = $("#bubble");

        // Store bubble and its infos
        this.self = bubble;
        this.info = bubble.find("#bubble-info");
        this.time = bubble.find("#bubble-time");
    };

    /**
     * update
     */
    this.update = function () {

        // Get infos about element
        var x = this.e.attr("x");
        var y = this.e.attr("y");
        var type = this.e.attr("class");

        // Convert time if desired
        if (this.format) {
            x = convertTime(x, this.format);
        }

        // Round info if desired
        if (this.round) {
            y = round(y, this.round);
        }

        // Update infos in bubble
        this.time.html(x);
        this.info.html("<span class='" + type + "'>" + y + "</span>" +
            " " + this.units);
    };

    /**
     * show
     * @param offsetX
     * @param offsetY
     */
    this.show = function (offsetX = 8, offsetY = 0) {

        // Define bubble coordinates
        var offsetTop = parseFloat(this.e.parent().position().top);
        var x = parseFloat(this.e.position().left) +
            parseFloat(this.e.css("width")) + offsetX;
        var y = parseFloat(this.e.position().top) + offsetY + offsetTop;

        // Define bubble size
        var w = this.self.outerWidth();
        var h = this.self.outerHeight();

        // Adjust position of bubble due to it being in content element
        if (offsetTop) {
            y += h; // FIXME
        }

        // Position bubble on graph
        this.self.css({
            "left": x + "px",
            "top": y + "px"
        });

        // If bubble exceeds width of graph
        if (x + w > this.e.parent().outerWidth()) {
            this.self.css({
                "left": x - 3 * offsetX - w + "px"
            });
        }

        // If bubble exceeds height of graph
        if (y + h > this.e.parent().outerHeight()) {
            this.self.css({
                "top": y - 3 * offsetY - h + "px"
            });
        }

        // Show bubble
        this.self.show();
    };

    /**
     * hide
     */
    this.hide = function () {
        this.self.hide();
    }
};