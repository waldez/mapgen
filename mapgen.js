'use strict';

const Graph = require('./graph');
const Grid = require('./grid');

const { DIRECTIONS } = Grid;

const definitions = {
    BASIC: {
        nodes: {

        },
        links: {

        }
    }
};

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

function markAdjacentCells(fillGrid, x, y, mask, path, maxPath) {

    for (const direction of DIRECTIONS) {
        const [xStep, yStep] = STEP_VECTORS[direction];
        const xA = x + xStep;
        const yA = y + yStep;

        // TODO: ....

    }
}

/**
 * @param  {Grid} grid
 * @param  {number} x
 * @param  {number} y
 * @param  {Set} mask determins which cell types (if not empty) are taken as empty, so they can be flooded
 * @param  {Number} minPath
 * @param  {Number} maxPath
 */
function floodFill(grid, x, y, mask, minPath = 1, maxPath = 8) {

    const filledGrid = new Grid(grid);



    return filledGrid.detachPredecessor();
}

class MapGen {

    constructor(graph, options) {

        // initialization
        Object.assign(this, {
            graph
        }, options);
    }

    processNode(node, grid, layoutGrid, visitedNodes, goingFromNode, placementAdepts = new Grid(null, [[0, 0, 1]])) {

        if (visitedNodes.has(node)) {
            return grid;
        }
        visitedNodes.add(node);

        const { links, name, type, minSize } = node;

        // TODO: move it to definitions
        const MAX_PORTS_PER_NODE = 4;

        const minNodeSize = Math.round(links.length / MAX_PORTS_PER_NODE);
        // TODO: check from type definition, if minNodeSize is <= nodeDefinition.maxSize

        // for (const [x, y, data, newLine] of grid.cells({ originShift: true, everyCell: true })) {
        //     lines += (newLine ? '\n' : '') + ((data && data[0]) || '░');
        // }

        return grid;
    }

    generate(grid = new Grid()) {

        const layoutGrid = new Grid();
        const visitedNodes = new Set();

        let actualGrid = new Grid(grid);

        for (const node of this.graph.nodes) {
            // actualGrid = this.processNode(node, actualGrid, layoutGrid, visitedNodes, null /*, firstNodeCellAdepts*/) || actualGrid;
            actualGrid = this.processNode(node, actualGrid, layoutGrid, visitedNodes, null /*, firstNodeCellAdepts*/);
        }

        return actualGrid;
    }
}

module.exports = MapGen;

// map gen test
(function () {
    console.log(`!W! - hello mapgen!`);
})();
