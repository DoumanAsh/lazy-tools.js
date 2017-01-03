'use strict';

const HTML = `
<header>
    <div>
        <h1>Markdown Parser</h1>
        <p>Use it to parse markdown files by either dragging in or selecting below</p>
    </div>
    <img src="/img/md.png" height="154", width="250"></img>
</header>

<main>
    <section>
        <h2>Select files:</h2>
        <input id="md" type='file' name="files[]" accept='.markdown,.md' multiple/>
    </section>
</main>
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
