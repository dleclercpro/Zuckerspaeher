export class Dots {

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     CONSTRUCTOR
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    constructor() {

    	// Initialize self
    	this.reset();

    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     RESET
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    reset() {

    	// Reset self
    	this.self = [];

    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     BUILD
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    build(type, data) {

        // Destructure data
        const [x, y] = data;

        // Build dot elements
        for (let i = 0; i < x.length; i++) {

            // Generate dot
            let dot = $("<div class='" + type + "' x=" + x[i] + " y=" + y[i] + "></div>");

            // Store it
            this.self.push(dot);
        }

        // Return dots
        return this.self;
	}

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     SHOW
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    show(graph) {

        // Get axis ticks
        const xTicks = graph.xAxis.self.find(".graph-x-axis-tick");
        const yTicks = graph.yAxis.self.find(".graph-y-axis-tick");

        // Get dots
        const dots = graph.inner.self.find("." + this.type);

        // Get dot styles
        const radiusDot = parseFloat(dots.first().outerWidth()) / 2;
        const thicknessXTick = parseFloat(xTicks.first().css("border-left-width") ||
                                          xTicks.first().css("border-right-width"));
        const thicknessYTick = parseFloat(yTicks.first().css("border-top-width") ||
                                          yTicks.first().css("border-bottom-width")); // FIXME

        // Extract information from dots
        let X = [];
        let Y = [];

        for (let dot of dots) {
            X.push(parseFloat($(dot).attr("x")));
            Y.push(typeof(y0) == "number" ? y0 : parseFloat($(dot).attr("y")));
        }

        // Compute coordinates of dots
        let x = [];
        let y = [];

        for (let i = 0; i < dots.length; i++) {

            // Compute distance with inner extremities
            let dx = X[i] - this.xMin;
            let dy = Y[i] - this.yMin;

            // Convert to pixels
            x.push(dx / this.dX * this.inner.width - radiusDot - thicknessXTick / 2);
            y.push(dy / this.dY * this.inner.height - radiusDot + thicknessYTick / 2);
        }

        // Position dots on graph
        for (let i = 0; i < dots.length; i++) {

            // Set CSS
            dots.eq(i).css({
                "left": x[i],
                "bottom": y[i]
            });
        }

        for (let dot of dots) {

            // When mouse enters dot
            $(dot).on("mouseenter", (e) => {

                // Update bubble
                this.bubble.update(e.currentTarget, type, units, round, "YYYY.MM.DD - HH:MM:SS");

                // Show bubble
                this.bubble.show();
            });

            // When mouse exits dot
            $(dot).on("mouseleave", (e) => {

                // Hide bubble
                this.bubble.hide();
            });
        }
    }

}