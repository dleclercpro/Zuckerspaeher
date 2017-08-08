M.Dash = function Dash (dBGdtScale) {

    /**
     * get
     */
    this.get = function () {

        // Store dash and its infos
        this.self = $("#dash");
        this.live = this.self.find("#dash-live");
        this.delta = this.self.find("#dash-delta");
        this.basal = this.self.find("#dash-basal");
        this.onBoard = this.self.find("#dash-on-board");
        this.factors = this.self.find("#dash-factors");
        //this.age = this.self.find("#dash-age");

        this.BG = $("#dash-BG").add("#user-BG");
        this.arrow = $("#dash-arrow").add("#user-arrow");

        this.dBG = this.self.find("#dash-dBG");
        this.dBGdt = this.self.find("#dash-dBG-dt");
        this.TB = this.self.find("#dash-TB");
        this.BR = this.self.find("#dash-BR");
        this.IOB = this.self.find("#dash-IOB");
        this.COB = this.self.find("#dash-COB");
    };

    /**
     * update
     */
    this.update = function () {

        // Get BGs and TBs
        var BGs = $("#graph-BG").find(".BG");
        var TBs = $("#graph-I").find(".TB");

        // Get last BG infos
        var lastBG = BGs.eq(-1).attr("y");
        var lastBGType = BGs.eq(-1).attr("class");
        var dBG = round(BGs.eq(-1).attr("y") - BGs.eq(-2).attr("y"), 1);
        var dt = (parseInt(BGs.eq(-1).attr("x")) -
            parseInt(BGs.eq(-2).attr("x"))) / 1000 / 60 / 60; // (h)
        var dBGdt = round(dBG / dt, 1);

        // Update infos in dash
        this.BG.text(round(lastBG, 1));
        this.BG.addClass(lastBGType);
        this.dBG.text(dBG);
        this.dBGdt.text(dBGdt);
        this.arrow.text(rankdBGdt(dBGdt, dBGdtScale)).addClass(lastBGType);
        this.TB.text(round(TBs.eq(-2).attr("y"), 1));
    }

    /**
     * init
     */

    this.dBGdtScale = dBGdtScale;

};