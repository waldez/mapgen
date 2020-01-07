'use strict';

const Graph = require('./graph');
const Grid = require('./grid');
const MapGen = require('./mapgen');

const chalk = require('chalk');

// TODO: TMP: smazat
const floodFill = require('./floodfill');

// ─━│┃┄┅┆┇┈┉┊┋┌┍┎┏┐┑┒┓└┕┖┗┘┙┚┛├┝┞┟┠┡┢┣┤┥┦┧┨┩┪┫┬┭┮┯┰┱┲┳┴┵┶┷┸┹┺┻┼┽┾┿╀╁╂╃╄╅╆╇╈╉╊╋╌╍╎╏═║╒╓╔╕╖╗╘╙╚╛╜╝╞╟╠╡╢╣╤╥╦╧╨╩╪╫╬▀▁▂▃▄▅▆▇█▉▊▋▌▍▎▏▐░▒▓▔▕▖▗▘▙▚▛▜▝▞▟
// const TILES_RAW = '─━│┃┄┅┆┇┈┉┊┋┌┍┎┏┐┑┒┓└┕┖┗┘┙┚┛├┝┞┟┠┡┢┣┤┥┦┧┨┩┪┫┬┭┮┯┰┱┲┳┴┵┶┷┸┹┺┻┼┽┾┿╀╁╂╃╄╅╆╇╈╉╊╋╌╍╎╏═║╒╓╔╕╖╗╘╙╚╛╜╝╞╟╠╡╢╣╤╥╦╧╨╩╪╫╬▀▁▂▃▄▅▆▇█▉▊▋▌▍▎▏▐░▒▓▔▕▖▗▘▙▚▛▜▝▞▟';
// const TILES_RAW = '─━│┃┄┅┆┇┈┉┊┋┌┍┎┏┐┑┒┓└┕┖┗┘┙┚┛├┝┞┟┠┡┢┣┤┥┦┧┨┩┪┫┬┭┮┯┰┱┲┳┴┵┶┷┸┹┺┻┼┽┾┿╀╁╂╃╄╅╆╇╈╉╊╋╌╍╎╏═║╒╓╔╕╖╗╘╙╚╛╜╝╞╟╠╡╢╣╤╥╦╧╨╩╪╫╬▀▁▂▃▄▅▆▇█▉▊▋▌▍▎▏▐░▒▓▔▕▖▗▘▙▚▛▜▝▞▟';
const TILES_RAW = '━┃╼╽╾╿█SE';
// const TILES = TILES_RAW.split('');
const TILES = [
    {
        gfx: '█'
    },
    {
        gfx: '━'
    }
    

];

// const tmp = `
// ━┃╼╽╾╿█SE


//     █ S
//     ┃ ╿
//   █━█━█╾E
//   ┃   ╽
//   █━━━█
// `;

// console.log('!W! - TILES:', TILES);
// console.log('!W! - tmp:', tmp);

function cellRenderer(data) { return ((data && data[0]) || chalk.blackBright('░')); }
function fillCellRenderer(data) { return ((data && (data.pathLength || (data[0] && chalk.red(data[0])))) || chalk.blackBright('░')); }

function simpleGridRenderer(grid, renderFn = cellRenderer) {

    let lines = '';
    for (const [x, y, data, newLine] of grid.cells({ originShift: true, everyCell: true })) {
        lines += (newLine ? '\n' : '') + renderFn(data);
    }

    return lines;
}

function listAllCells(grid) {

    let lines = '';
    for (const cell of grid.cells({ originShift: false, everyCell: false })) {
        lines += cell.toString() + '\n';
    }

    return lines;
}

// graph test
(function () {
    
    const { createNode, link, LINK_TYPES } = Graph;

    const nodes = [
        createNode('Start', 'start'),   // 0
        createNode('Village'),          // 1
        createNode('Forest'),           // 2
        createNode('Cave'),             // 3
        createNode('Waterfall'),        // 4
        createNode('End', 'end'),       // 5
        createNode('Church'),           // 6
    ];

    link(nodes[0], nodes[1], LINK_TYPES.SOURCE);
    link(nodes[1], nodes[2], LINK_TYPES.BOTH_WAYS);
    link(nodes[5], nodes[1], LINK_TYPES.TARGET);
    link(nodes[2], nodes[3], LINK_TYPES.SOURCE);
    link(nodes[3], nodes[4], LINK_TYPES.BOTH_WAYS);
    link(nodes[4], nodes[1], LINK_TYPES.SOURCE);
    link(nodes[1], nodes[6], LINK_TYPES.BOTH_WAYS);

    const graph = new Graph(nodes);

    const gvDot = graph.renderGVDot();

    console.log(`!W! - ===================== graphwiz .dot =====================\n`);
    console.log(gvDot);

    require('fs').writeFileSync(__dirname + '/test.dot', gvDot);

    const mapGen = new MapGen(graph);
    const grid = mapGen.generate();
    console.log(`!W! - ===================== RENDER =====================\n`);
    const lines = simpleGridRenderer(grid);
    console.log(lines);
})();

// grid test
(function () {

    // return;
    // GRID 1
    const grid = new Grid(
        null, 
        [
            [ 0, 0, 'Village'],
            [-2, 0, 'Start'],
            [ 0, 2, 'Forest'],
            [ 2,-1, 'End'],
            [ 2, 2, 'Cave'],
            [ 3, 1, 'Waterfall']
        ]
    );

    console.log('!W! - grid.bounds:', grid.bounds);
    console.log('!W! - grid.dimensions:', grid.dimensions);

    const { width, height } = grid.dimensions;

    console.log(`!W! - ===================== RENDER grid =====================\n`);
    const lines = simpleGridRenderer(grid);
    console.log(lines);
    console.log(`!W! - ===================== List grid =====================\n`);
    console.log(listAllCells(grid));

    // GRID 2
    const grid2 = new Grid(grid);

    grid2.set( 0,-2, 'Church');

    console.log('!W! - grid2.bounds:', grid2.bounds);
    console.log('!W! - grid2.dimensions:', grid2.dimensions);

    console.log('!W! - grid2.pred:', grid2.pred);
    console.log(`!W! - ===================== RENDER grid 2 =====================\n`);
    const lines2 = simpleGridRenderer(grid2);
    console.log(lines2);

    console.log(`!W! - ===================== List grid 2 =====================\n`);
    console.log(listAllCells(grid2));

    const grid3 = grid2.clone();
    console.log('!W! - grid3.pred:', grid3.pred);
    console.log(`!W! - ===================== RENDER grid 3 =====================\n`);
    const lines3 = simpleGridRenderer(grid3);
    console.log(lines3);

    console.log(`!W! - ===================== List grid 3 =====================\n`);
    console.log(listAllCells(grid3));

    console.log(`!W! - ===================== Floodfill test =====================\n`);

    const floodedGrid = floodFill(grid, 3, 3, undefined, 6);
    const floodedLines = simpleGridRenderer(floodedGrid, fillCellRenderer);
    console.log(floodedLines);

    console.log(`!W! - ===================== Floodfill test 2 =====================\n`);

    const gridWall = new Grid(
        null, 
        [
            [-2,-3, '|'],
            [-2,-2, '|'],
            [-2,-1, '|'],
            [-2, 0, '|'],
            [-3, 0, '-'],
            [-4, 0, '-']
        ]
    );

    const floodedGrid2 = floodFill(gridWall, 0, 0, undefined, 9);
    console.log(simpleGridRenderer(floodedGrid2, fillCellRenderer));

    console.log(simpleGridRenderer(gridWall, fillCellRenderer));
})();

