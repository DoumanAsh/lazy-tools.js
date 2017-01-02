'use strict';

const HTML = `
<img class="404" src="/img/404.png"></img>
<p> Unknown tool </p>
`;

function NotFound() {
}

export default {
    html: HTML,
    constructor: NotFound
};
