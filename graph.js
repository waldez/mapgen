'use strict';

const { defineEnum, assert } = require('./utils');

const LINK_TYPES = defineEnum([
    ['BOTH_WAYS', 0],
    ['SOURCE', -1],
    ['TARGET', 1]
])

function createNode(name, type, minSize = 1) {

    return {
        name,
        type,
        minSize,
        links: new Set()
    };
}


function link(first, second, linkType, style) {

    assert(first);
    assert(second);
    assert(typeof linkType === 'number');

    const firstLinkType = linkType;
    const secondLinkType = linkType * -1;

    first.links.add({ type: secondLinkType, node: second, style });
    second.links.add({ type: firstLinkType, node: first, style });
}

class Graph {

    constructor(nodes) {
    
        if (Array.isArray(nodes)) {
            this.nodes = new Set(nodes);
        } else if (nodes instanceof Set) {
            this.nodes = nodes;
        }

        !this.nodes && (this.nodes = new Set());
    }

    createNode(name, type, minSize) {

        const node = createNode(name, type, minSize)
        this.nodes.add(node);
        return node;
    }

    link(...args) {
        // TODO: check, if first two params are nodes from this graph....
        return link(...args);
    }

    attach(node) { this.nodes.add(node); }

    renderGVDot() {

        const nodesArray = Array.from(this.nodes);
        const links = new Set();
        let renderedNodes = '';

        this.nodes.forEach(n => {
            renderedNodes += `${n.name};\n    `;
            // inefficient, all links are added twice..
            n.links.forEach(l => {
                const renderedLink = l.type === LINK_TYPES.SOURCE ?
                    `${l.node.name} -> ${n.name};` :
                    `${n.name} -> ${l.node.name};`;
                links.add(renderedLink);
            });
        });

        return '' +
`digraph g {

    // rankdir=LR;
    // node [shape = record];

    ${renderedNodes}

    ${Array.from(links).join('\n    ')}
}`;
    }
}

Graph.LINK_TYPES = LINK_TYPES;
Graph.link = link;
Graph.createNode = createNode;

module.exports = Graph;
