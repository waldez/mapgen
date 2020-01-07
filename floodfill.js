'use strict';

const { defineEnum } = require('./utils');
const Grid = require('./grid');

const DIRECTIONS = defineEnum([
    ['TOP', -2],
    ['RIGHT', 1],
    ['BOTTOM', 2],
    ['LEFT', -1]
]);

class FloodedCell {
    /**
     * [constructor description]
     * @param  {Graph.DIRECTIONS} floodedFrom
     * @param  {number} pathLength
     * @return {FloodedCell}
     */
    constructor(floodedFrom, pathLength) {

        Object.assign(this, { floodedFrom, pathLength });
    }

    toString() {
        return this.pathLength.toString();
    }
}

const STEP_VECTORS = {
    TOP: [0, -1],
    RIGHT: [1, 0],
    BOTTOM: [0, 1],
    LEFT: [-1, 0]
}

function markAdjacentCells(fillGrid, x, y, mask, actualPath, maxPath) {

    for (const [direction, dirCode] of DIRECTIONS) {
        const [xStep, yStep] = STEP_VECTORS[direction];
        const xA = x + xStep;
        const yA = y + yStep;

        const fromDirectionCode = -dirCode;
        const cell = fillGrid.get(xA, yA);

        let advance = false;
        if (!cell || mask.has(cell.type)) {
            // TODO: deal with already assigned Nodes...
            // fill the cell
            fillGrid.set(xA, yA, new FloodedCell(fromDirectionCode, actualPath + 1));
            advance = true;
        } else if (cell instanceof FloodedCell) {
            // check, if this path is shorter
            // if yes, replace the node and also continue to flood this way!
            if (actualPath + 1 < cell.pathLength) {
                fillGrid.set(xA, yA, new FloodedCell(fromDirectionCode, actualPath + 1));                
                advance = true;
            }
        }

        if (advance && ((actualPath + 1) < maxPath)) {
            markAdjacentCells(fillGrid, xA, yA, mask, actualPath + 1, maxPath);
        }
    }
}

/**
 * @param  {Grid} grid
 * @param  {number} x
 * @param  {number} y
 * @param  {Set} mask determins which cell types (if not empty) are taken as empty, so they can be flooded
 * @param  {Number} maxPath
 */
function floodFill(grid, x, y, mask = new Set(), maxPath = 8) {

    const fillGrid = new Grid(grid);
    // TODO: remove!!!
    fillGrid.set(x, y, {});
    markAdjacentCells(fillGrid, x, y, mask, 0, maxPath);
    return fillGrid;
}

floodFill.DIRECTIONS = DIRECTIONS;

module.exports = floodFill;
