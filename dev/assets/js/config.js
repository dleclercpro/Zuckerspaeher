/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

 Title:    config.js

 Author:   David Leclerc

 Version:  0.1

 Date:     17.08.2017

 License:  GNU General Public License, Version 3
 (http://www.gnu.org/licenses/gpl.html)

 Overview: ...

 Notes:    ...

 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

// Imports
import * as lib from "./lib";

// Config
export let
    dx = 1, // Time step (h)
    dX = 12, // Time range (h)
    y0 = 0, // Basal baseline (U/h)
    yBG = [0, 2, 4, 6, 8, 10, 15, 20], // mmol/L
    yI = lib.mirror([2, 4], true), // U/h
    BGScale = {
      ranks: ["very-low", "low", "normal", "high", "very-high"],
      limits: [3.8, 4.2, 7.0, 9.0], // (mmol/L)
    },
    dBGdtScale = {
      ranks: ["↓↓", "↓", "↘", "→", "↗", "↑", "↑↑"],
      limits: lib.mirror([0.1, 0.3, 0.5]), // (mmol/L/5m)
    },
    batteryLevelScale = {
      ranks: ["very-low", "low", "medium", "high", "very-high"],
      limits: [20, 50, 75, 90], // (%)
    },
    reservoirLevelScale = {
      ranks: ["very-low", "low", "medium", "high", "very-high"],
      limits: [25, 50, 100, 200], // (U)
    };

// Convert time units
dx *= 60 * 60 * 1000; // (ms)
dX *= 60 * 60 * 1000; // (ms)
dBGdtScale.limits = dBGdtScale.limits.map(x => lib.round(x * 60 / 5, 1)); // (mmol/L/h)