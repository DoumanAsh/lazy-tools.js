'use strict';

import Aru from './data/Aru.js';

const HTML = `
<header>
    <h1>Markdown Parser</h1>
    <a class="settings" onclick="{this.open_settings}">&#x2699</a>
</header>
<main ondrop="{this.on_drop}" ondragover="{this.on_dragover}">
    <section>
        <label class="file_upload">
            Upload Markdown
            <input onchange="{this.on_md}" style="display: none" type='file' name="files[]" accept='.markdown,.md' multiple/>
        </label>
    </section>

    <section if="{this.state.settings.settings_window}" class="app_settings">
        <header>Settings</header>
        <button class="close" onclick="{this.close_settings}">&#10006</button>
        <div>
            <label title="Inline Github CSS into result HTML">
                <input type="checkbox" checked="{this.state.settings.github_style}" name="github_style" onchange="{this.settings}"/>
                Github CSS Style
            </label>
            <label title="Inline Github CSS for code into result HTML">
                <input type="checkbox" checked="{this.state.settings.github_code_style}" name="github_code_style" onchange="{this.settings}"/>
                Github CSS Style
            </label>
            <label title="Set nesting level for Table of Content">
                <input class="single_num" type="number" value="{this.state.settings.toc}" name="toc" onchange="{this.settings}" maxLength="1" min="0" max="6"/>
                Table of Content Level
            </label>
        </div>
    </section>
</main>
`;

function Markdown() {
    this.state = {
        settings_window: false,
        settings: {
            name: "md_settings",
            github_style: false,
            github_code_style: false,
            toc: 0
        }
    };

    this.load_settings = () => {
        const load_settings = localStorage.getItem(this.state.settings.name);
        if (load_settings) this.state.settings = JSON.parse(load_settings);
    };

    this.save_settings = () => {
        localStorage.setItem(this.state.settings.name, JSON.stringify(this.state.settings));
    };

    this.on('mount', () => {
        this.load_settings();
    });

    this.on('unmount', () => {
        this.save_settings();
    });

    this.settings = (event) => {
        if (event.target.type === 'checkbox') {
            this.state.settings[event.target.name] = event.target.checked;
        }
        else if (event.target.type === 'number') {
            if (event.target.validity.valid) {
                this.state.settings[event.target.name] = event.target.value;
            }
        }
    };

    this.open_settings = () => {
        this.state.settings.settings_window = true;
        this.opts.parent.trigger("aru_change", Aru.speech.md_settings, Aru.expression.smile_c);
    };

    this.close_settings = () => {
        this.state.settings.settings_window = false;
        this.save_settings();
        this.opts.parent.trigger("aru_change", Aru.speech.md_settings_close, Aru.expression.smile);
    };

    this.on_dragover = (event) => {
        event.stopPropagation();
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    };

    this.on_drop = (event) => {
        event.preventDefault();
    };

    this.on_md = (event) => {
    };
}

export default {
    html: HTML,
    constructor: Markdown
};
