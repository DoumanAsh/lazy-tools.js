'use strict';

const HTML = `
<h1>{opts.title}</h1>
`;

function Index(opts) {
    this.opts = opts;
}

export default {
    name: 'Index',
    html: HTML,
    constructor: Index
};
