'use strict';

const Graph = require('./graph')

console.log('Hello mapgen!');

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

const tmp = `
━┃╼╽╾╿█SE


    █ S
    ┃ ╿
  █━█━█╾E
  ┃   ╽
  █━━━█
`;

console.log('!W! - TILES:', TILES);
console.log('!W! - tmp:', tmp);

(function test() {
    
    const { createNode, link, LINK_TYPES } = Graph;

    const nodes = [
        createNode('Start', 'start'),
        createNode('Village'),
        createNode('Forest'),
        createNode('Cave'),
        createNode('Waterfall'),
        createNode('End', 'end'),
    ];

    link(nodes[0], nodes[1], LINK_TYPES.SOURCE);
    link(nodes[1], nodes[2], LINK_TYPES.BOTH_WAYS);
    link(nodes[5], nodes[1], LINK_TYPES.TARGET);
    link(nodes[2], nodes[3], LINK_TYPES.SOURCE);
    link(nodes[3], nodes[4], LINK_TYPES.BOTH_WAYS);
    link(nodes[4], nodes[1], LINK_TYPES.SOURCE);

    // link(nodes[5], nodes[0], LINK_TYPES.TARGET);

    const graph = new Graph(nodes);

    const gvDot = graph.renderGVDot();

    console.log(`!W! - ===================== graphwiz .dot =====================\n`);
    console.log(gvDot);

    require('fs').writeFileSync(__dirname + '/test.dot', gvDot);

})()
