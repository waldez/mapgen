'use strict';

const Graph = require('./graph');
const Grid = require('./grid');

// const { DIRECTIONS } = Grid;

const definitions = {
    BASIC: {
        nodes: {

        },
        links: {

        }
    }
};

class MapGen {

    constructor(graph, options) {
        // initialization
        Object.assign(this, {
            graph
        }, options);
    }

    processNode(node, grid, /*layoutGrid,*/ visitedNodes, goingFromNode, placementAdepts = new Grid(null, [[0, 0, 1]])) {

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

        // const layoutGrid = new Grid();
        const visitedNodes = new Set();

        let actualGrid = new Grid(grid);

        for (const node of this.graph.nodes) {
            // actualGrid = this.processNode(node, actualGrid, layoutGrid, visitedNodes, null /*, firstNodeCellAdepts*/) || actualGrid;
            actualGrid = this.processNode(node, actualGrid, /*layoutGrid,*/ visitedNodes, null /*, firstNodeCellAdepts*/);
        }

        return actualGrid;
    }
}

module.exports = MapGen;

// map gen test
(function () {
    console.log(`!W! - hello mapgen!`);
})();
