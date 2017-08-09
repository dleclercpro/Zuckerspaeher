// Imports
import * as lib from "../../assets/js/lib";

export class Dash {

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     CONSTRUCTOR
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    constructor(dBGdtScale) {

        // Get dash from DOM
        this.self = $("#dash");

        // Get its sub-elements
        this.live = this.self.find("#dash-live");
        this.delta = this.self.find("#dash-delta");
        this.basal = this.self.find("#dash-basal");
        this.onBoard = this.self.find("#dash-on-board");
        this.factors = this.self.find("#dash-factors");
        this.dBG = this.self.find("#dash-dBG");
        this.dBGdt = this.self.find("#dash-dBG-dt");
        this.TB = this.self.find("#dash-TB");
        this.BR = this.self.find("#dash-BR");
        this.IOB = this.self.find("#dash-IOB");
        this.COB = this.self.find("#dash-COB");
        this.BG = this.self.find("#dash-BG").add("#user-BG");
        this.arrow = this.self.find("#dash-arrow").add("#user-arrow");

        // Store dBG/dt scale
        this.dBGdtScale = dBGdtScale;
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     UPDATE
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    update() {

        // Get BGs and TBs
        const BGs = $("#graph-BG").find(".BG");
        const TBs = $("#graph-I").find(".TB");

        // Read lastest infos
        const lastBG = lib.round(BGs.eq(-1).attr("y"));
        const lastBGType = BGs.eq(-1).attr("class");
        const TB = lib.round(TBs.eq(-2).attr("y"));
        const dBG = lib.round(BGs.eq(-1).attr("y") - BGs.eq(-2).attr("y"));
        const dt = (parseInt(BGs.eq(-1).attr("x")) -
                    parseInt(BGs.eq(-2).attr("x"))) / 1000 / 60 / 60; // (h)

        // Compute latest infos
        const dBGdt = lib.round(dBG / dt);
        const arrow = lib.rankdBGdt(dBGdt, this.dBGdtScale);

        // Update infos in dash
        this.BG.text(lastBG);
        this.BG.addClass(lastBGType);
        this.dBG.text(dBG);
        this.dBGdt.text(dBGdt);
        this.arrow.text(arrow).addClass(lastBGType);
        this.TB.text(TB);
    }

}