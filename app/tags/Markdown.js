'use strict';

const HTML = `
<header>
    <h1>Markdown Parser</h1>
</header>
`;

function Markdown() {
    this.on('mount', () => {
    });

    this.on('unmount', () => {
    });
}

export default {
    html: HTML,
    constructor: Markdown
};
