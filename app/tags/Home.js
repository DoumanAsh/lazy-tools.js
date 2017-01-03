'use strict';

const HTML = `
<header>
    <h1>Lazy Tools</h1>
</header>
<main class="flex_list">
    <a class="button_link" href="{ref}" title="{desc}" each={this.opts.parent.store.app_links}>{name}</a>
</main>
`;

function Home() {
}

export default {
    html: HTML,
    constructor: Home
};
