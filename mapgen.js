'use strict';

const { assert } = require('./utils');

const Graph = require('./graph');
const Grid = require('./grid');

const floodFill = require('./floodfill');

const definitions = {
    BASIC: {
        nodes: {

        },
        links: {

        }
    }
};

function createMapCell(node, x, y, fromNode, fromNodeDirection) {

    const ports = new Map();
    ports.set(fromNodeDirection, fromNode);
    return { x, y, node, ports };
}

class MapGen {

    constructor(graph, options) {
        // initialization
        Object.assign(this, {
            graph
        }, options);
    }

    processNode(
        node,
        grid,
        visitedNodes,
        goingFromNode,
        placementAdepts
    ) {

        if (visitedNodes.has(node)) {
            // return grid;
            return null;
        }
        visitedNodes.add(node);

        const { links, name, type, minSize } = node;

        // TODO: move it to definitions
        const MAX_PORTS_PER_NODE = 4;
        const minNodeSize = Math.round(links.length / MAX_PORTS_PER_NODE);

        // TODO: check from type definition, if minNodeSize is <= nodeDefinition.maxSize
        // for (const [x, y, floodedCell] of placementAdepts.cells({ originShift: false, everyCell: false })) {
        const adeptsSorted = placementAdepts.sortedByPath;
        for (let i = 0; i < adeptsSorted.length; ++i) {
            // TODO: TMP remove - for debugging only!
            const path = i + 1;
            for (let { x, y, floodedFrom, pathLength } of adeptsSorted[i]) {
                // sanity check
                // TODO: TMP remove - for debugging only!
                assert(path === pathLength, 'Something went wrong during floodfil!');
                const mapData = grid.get(x, y);
                if (mapData) {
                    // TODO: ignore for now...
                } else {
                    const cell = createMapCell(node, x, y, goingFromNode, floodedFrom);
                    // TODO: implement:
                    // if (couldPlaceCell(cell)) {...}
                    let newGridLayer = new Grid(grid);
                    newGridLayer.set(x, y, cell);

                    // TODO: render link/path

                    // check all the links!
                    for (const /*link*/ { type, node: linkNode /*, style*/ } of node.links) {
                        const newPlacementAdepts = floodFill(newGridLayer, x, y, null /*mask*/, 9 /*should be maximum from links definitions*/);
                        newGridLayer = this.processNode(linkNode, newGridLayer, visitedNodes, cell, newPlacementAdepts) || newGridLayer;
                    }

                    return newGridLayer;
                }
            }
        }

        return grid;
    }

    generate(grid = new Grid()) {

        const visitedNodes = new Set();
        let actualGrid = new Grid(grid);

        // TODO: FIX: naive
        const placementAdepts = floodFill(actualGrid, 0, 0, void 0, 9);

        // only disjointed graphs will got through more than one step
        for (const node of this.graph.nodes) {
            actualGrid = this.processNode(node, actualGrid, visitedNodes, null, placementAdepts) || actualGrid;
        }

        return actualGrid;
    }
}

module.exports = MapGen;

