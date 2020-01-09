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
    constructor(floodedFrom, pathLength, x, y) {

        Object.assign(this, { floodedFrom, pathLength, x, y });
    }

    toString() {
        return this.pathLength.toString();
    }
}

const STEP_VECTORS = {
    TOP: [0, -1],
    RIGHT: [1, 0],
    BOTTOM: [0, 1],
    LEFT: [-1, 0],
    [-2]: [0, -1],
    [1]: [1, 0],
    [2]: [0, 1],
    [-1]: [-1, 0]
}

function step(x, y, direction) {

        const stepVec = STEP_VECTORS[direction];
        return [x + stepVec[0], y + stepVec[1]];
}

function markAdjacentCells(fillGrid, x, y, mask, actualPath, maxPath) {

    // UWAGA! index of cell array is one less than the actual path length!
    const sortedByPath = fillGrid.sortedByPath;

    for (const [direction, dirCode] of DIRECTIONS) {
        const [xA, yA] = step(x, y, direction);
        const fromDirectionCode = -dirCode;
        const cell = fillGrid.get(xA, yA);

        let advance = false;
        if (!cell || (mask && mask.has(cell.type))) {
            // TODO: deal with already assigned Nodes...
            // fill the cell
            
            const floodedCell = new FloodedCell(fromDirectionCode, actualPath + 1, x, y);
            fillGrid.set(xA, yA, floodedCell);
            
            const distanceSet = sortedByPath[actualPath] || new Set();
            sortedByPath[actualPath] = distanceSet;

            distanceSet.add(floodedCell);

            advance = true;
        } else if (cell instanceof FloodedCell) {
            // check, if this path is shorter
            // if yes, replace the node and also continue to flood this way!
            if (actualPath + 1 < cell.pathLength) {
                // remove from old distance layer
                const distanceSetOld = sortedByPath[cell.pathLength - 1];
                distanceSetOld.delete(cell);

                // update cell data
                cell.floodedFrom = fromDirectionCode;
                cell.pathLength = actualPath + 1;

                // add to new one
                const distanceSetNew = sortedByPath[actualPath] || new Set();
                sortedByPath[actualPath] = distanceSetNew;
                distanceSetNew.add(cell);

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
    // UWAGA! index of cell array is one less than the actual path length!
    fillGrid.sortedByPath = [];
    markAdjacentCells(fillGrid, x, y, mask, 0, maxPath);
    return fillGrid;
}

floodFill.DIRECTIONS = DIRECTIONS;
floodFill.FloodedCell = FloodedCell;
floodFill.step = step;

module.exports = floodFill;
