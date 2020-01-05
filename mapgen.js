'use strict';

class Grid {

    constructor() {
    
        // members init
        Object.assign(this, {
            xMin: Number.MAX_SAFE_INTEGER,
            xMax: Number.MIN_SAFE_INTEGER,
            yMin: Number.MAX_SAFE_INTEGER,
            yMax: Number.MIN_SAFE_INTEGER,
            yAxis: new Map()
        });
    }

    get(x, y) {

        const xAxis = this.yAxis.get(y);
        return xAxis && xAxis.get(x);
    }

    set(x, y, data) {

        if (typeof data !== 'undefined') {
            this.xMin = Math.min(this.xMin, x);
            this.xMax = Math.max(this.xMax, x);
            this.yMin = Math.min(this.yMin, y);
            this.yMax = Math.max(this.yMax, y);
        }
        let xAxis = this.yAxis.get(y);
        !xAxis && (xAxis = new Map()) && this.yAxis.set(y, xAxis);
        xAxis.set(x, data);
    }

    get dimensions() {
        return {
            width: this.xMax - this.xMin + 1,
            height: this.yMax - this.yMin + 1
        }
    }

    getBounds() {

        const { xMin, xMax, yMin, yMax } = this;
        return { xMin, xMax, yMin, yMax };
    }

    *cells({ originShift, everyCell, sorted }) {

        let xOffset = 0;
        let yOffset = 0;

        if (originShift) {
            if (originShift === true) {
                xOffset = -this.xMin;
                yOffset = -this.yMin;
            } else if (typeof originShift === 'object') {
                xOffset = originShift.x;
                yOffset = originShift.y;
            }
        }

        if (everyCell) {
            let newLine = false;
            for (let y = this.yMin; y <= this.yMax; ++y, newLine = true) {
                const xAxis = this.yAxis.get(y);
                for (let x = this.xMin; x <= this.xMax; ++x) {
                    yield [x + xOffset, y + yOffset, xAxis && xAxis.get(x), newLine];
                    newLine = false;
                }
            }
        } else {
            // TODO: if it will be needed
        }
    }

    // TODO: for now, just adding, because if we will be dealing with deletion, there should be BBOX recomputation
    // delete(x, y) {

    //     let yAxis = this.xAxis.get(x);
    //     yAxis && yAxis.delete(y);
    // }
}

class MapGen {

}

module.exports = MapGen;

(function () {

    const grid = new Grid();

    grid.set( 0, 0, 'Village');
    grid.set(-2, 0, 'Start');
    grid.set( 0,-2, 'Church');
    grid.set( 0, 2, 'Forest');
    grid.set( 2,-1, 'End');
    grid.set( 2, 2, 'Cave');
    grid.set( 3, 1, 'Waterfall');

    console.log('!W! - grid.getBounds():', grid.getBounds());
    console.log('!W! - grid.dimensions:', grid.dimensions);

    const { width, height } = grid.dimensions;

    console.log(`!W! - ===================== RENDER =====================\n`);
    let lines = '';
    for (const [x, y, data, newLine] of grid.cells({ originShift: true, everyCell: true })) {
        lines += (newLine ? '\n' : '') + ((data && data[0]) || '_');
    }
    console.log(lines);
})();
