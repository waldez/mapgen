'use strict';

const { isIterable } = require('./utils');

class Grid {

    constructor(predecessor, items) {
    
        // members init
        Object.assign(this, {
            xMin: Number.MAX_SAFE_INTEGER,
            xMax: Number.MIN_SAFE_INTEGER,
            yMin: Number.MAX_SAFE_INTEGER,
            yMax: Number.MIN_SAFE_INTEGER,
            yAxis: new Map(),
            occupiedCells: 0,
            pred: predecessor,
        });

        if (isIterable(items)) {
            for (const args of items) {
                this.set(...args);
            }
        }
    }

    get(x, y) {

        const xAxis = this.yAxis.get(y);
        // TODO: deal with simple values (like false, 0, '' etc..)
        return (xAxis && xAxis.get(x)) || this.pred && this.pred.get(x, y);
    }

    set(x, y, data) {

        if (typeof data !== 'undefined') {
            this.xMin = Math.min(this.xMin, x);
            this.xMax = Math.max(this.xMax, x);
            this.yMin = Math.min(this.yMin, y);
            this.yMax = Math.max(this.yMax, y);
    
            let xAxis = this.yAxis.get(y);
            !xAxis && (xAxis = new Map()) && this.yAxis.set(y, xAxis);
            xAxis.set(x, data);

            ++this.occupiedCells;
        }

        return this;
    }

    get nonEmptyCellsCount() {

        const predCount = this.pred && this.pred.nonEmptyCellsCount || 0;
        return predCount + this.occupiedCells;
    }

    get dimensions() {

        const { xMin, xMax, yMin, yMax } = this.getBounds();
        return {
            width: xMax - xMin + 1,
            height: yMax - yMin + 1
        }
    }

    getBounds() {

        if (this.pred) {
            const { xMin, xMax, yMin, yMax } = this;
            const predBounds = this.pred.getBounds();
            return {
                xMin: Math.min(xMin, predBounds.xMin),
                xMax: Math.max(xMax, predBounds.xMax),
                yMin: Math.min(yMin, predBounds.yMin),
                yMax: Math.max(yMax, predBounds.yMax),
            };
        } else {
            const { xMin, xMax, yMin, yMax } = this;
            return { xMin, xMax, yMin, yMax };
        }
    }

    clone() {
        return new Grid(null, this.cells({
            originShift: false,
            everyCell: false,
            sorted: false
        }));
    }

    *cells({ originShift, everyCell, sorted }) {

        let xOffset = 0;
        let yOffset = 0;

        const { xMin, xMax, yMin, yMax } = this.getBounds();

        if (originShift) {
            if (originShift === true) {
                xOffset = -xMin;
                yOffset = -yMin;
            } else if (typeof originShift === 'object') {
                xOffset = originShift.xOffset;
                yOffset = originShift.yOffset;
            }
        }

        if (everyCell) {
            let newLine = false;
            for (let y = yMin; y <= yMax; ++y, newLine = true) {
                for (let x = xMin; x <= xMax; ++x) {
                    const data = this.get(x, y);
                    yield [x + xOffset, y + yOffset, data, newLine];
                    newLine = false;
                }
            }
        } else {
            // TODO: sorted version ignored for now... it will be pain in the butt to implement...

            // TODO: FIX - resolve, if there is item on same x,y coordinates in predecessor
            if (this.pred) {
                yield* this.pred.cells({
                    originShift: { xOffset, yOffset },
                    everyCell: false,
                    sorted
                });
            }

            for (const [y, xAxis] of this.yAxis) {
                for (const [x, data] of xAxis) {
                    yield [x + xOffset, y + yOffset, data];
                }
            }
        }
    }

    // TODO: for now, just adding, because if we will be dealing with deletion, there should be BBOX recomputation
    // delete(x, y) {

    //     let yAxis = this.xAxis.get(x);
    //     yAxis && yAxis.delete(y);
    // }
}

module.exports = Grid;
