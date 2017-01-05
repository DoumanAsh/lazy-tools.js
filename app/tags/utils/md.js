'use strict';

import markdown_it from "markdown-it";
import markdown_it_github_toc from "markdown-it-github-toc";
import hljs from 'highlight.js';

class MD {
    constructor() {
        this.options = {
            toc: 0,
            css: '',
            css_code: ''
        };

        this.inner = markdown_it({
            highlight: (code, lang) => {
                return !this.options.css_code || !lang || !hljs.getLanguage(lang) ? code : hljs.highlight(lang, code).value;
            }
        }).use(markdown_it_github_toc, this._get_toc_options());
    }

    /**
     * Set value to option by name.
     *
     * @param {String} name Name of option.
     * @param {Any} value Value of option. Type depends on option.
     *
     * @throws On non-existing option name.
     *
     * @return {void}
     */
    set_option(name, value) {
        if (!(name in this.options)) throw "Unknown options " + name;

        this[name](value);
    }

    /**
     * Sets toc option and re-use plugin.
     *
     * @param {Number} value New value to set.
     * @return {void}
     */
    toc(value) {
        this.options.toc = value;
        this.inner.use(markdown_it_github_toc, this._get_toc_options());
    }

    /**
     * Sets CSS style to inline in HTML.
     *
     * @param {String} value CSS string.
     * @return {void}
     */
    css(value) {
        this.options.css = value;
    }

    /**
     * Sets CSS style to inline in HTML.
     *
     * @param {String} value CSS string.
     * @return {void}
     */
    css_code(value) {
        this.options.css_code = value;
    }

    /**
     * Internal method to produce toc options for markdown_it.
     *
     * @return {Object} markdown_it_github_toc options.
     */
    _get_toc_options() {
        const result = {
            toc: false,
            anchorLink: false,
            tocFirstLevel: 1,
            tocLastLevel: 6
        };

        if (this.options.toc > 0) {
            result.toc = true;
            result.anchorLink = true;
            result.tocLastLevel = this.options.toc;
        }

        return result;
    }

    /**
     * Redner Markdown string into HTML string.
     *
     * @param {String} string Markdown text.
     * @param {String} title Title of HTML.
     * @return {String} Result HTML.
     */
    render(string, title='') {
        return `<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8"></meta>
    <title>${title}</title>
    <style>
        ${this.options.css} ${this.options.css_code}
    </style>
</head>
<body>
    <article class="markdown-body">
        ${this.inner.render(string)}
    </article>
</body>
</html>`;
    }
}

export default MD;
