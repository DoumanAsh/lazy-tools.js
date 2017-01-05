'use strict';
import JSZip from 'jszip';

import Aru from './data/Aru.js';
import {GithubCode, GithubMarkdown} from './data/css.js';

import {handle_read_error, read_text_file, save_text_file, save_blob} from './utils/file.js';
import md_parser from './utils/md.js';

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
        },
    };

    this.parser = new md_parser();

    /**
     * Sets all settings into parser.
     *
     * @return {void}
     */
    this.parser_set_settings = () => {
        Object.keys(this.parser_settings_setters).forEach((setting) => {
            this.parser_settings_setters[setting]();
        });
    };

    this.parser_settings_setters = {
        toc: () => {
            this.parser.toc(parseInt(this.state.settings.toc, 10));
        },
        github_style: () => {
            this.parser.css(this.state.settings.github_style ? GithubMarkdown : '');
        },
        github_code_style: () => {
            this.parser.css_code(this.state.settings.github_code_style ? GithubCode : '');
        },
    };

    /**
     * Loads MD parser settings from localStorage.
     *
     * @return {void}
     */
    this.load_settings = () => {
        const load_settings = localStorage.getItem(this.state.settings.name);
        if (load_settings) this.state.settings = JSON.parse(load_settings);
    };

    /**
     * Saves MD parser settings to localStorage as JSON string.
     *
     * @return {void}
     */
    this.save_settings = () => {
        localStorage.setItem(this.state.settings.name, JSON.stringify(this.state.settings));
    };

    this.on('mount', () => {
        this.load_settings();
        this.parser_set_settings();
    });

    this.on('unmount', () => {
        this.save_settings();
    });

    this.settings_setters = {
        'checkbox': (event) => {
            this.state.settings[event.target.name] = event.target.checked;
        },
        'number': (event) => {
            if (event.target.validity.valid) {
                this.state.settings[event.target.name] = event.target.value;
            }
        }
    };

    this.settings = (event) => {
        this.settings_setters[event.target.type](event);
        this.parser_settings_setters[event.target.name]();
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


    this.parse_files = (file_list) => {
        const file_list_len = file_list.length;
        var handle_result, parsed_num, zip;

        function prepare_file_name(file_name) {
            const title = file_name.replace(/\.[^\.]+$/, '');
            const name = title + '.html';

            return {title: title, name: name};
        }

        const handle_single_file = (result, file_name) => {
            const {title, name} = prepare_file_name(file_name);

            save_text_file(name, this.parser.render(result, title), "text/html;charset=utf-8");
            this.opts.parent.trigger("aru_change", Aru.speech.md_parsing_done, Aru.expression.smile_c);
        };

        const handle_multiple_files = (result, file_name) => {
            const {title, name} = prepare_file_name(file_name);

            zip.file(name, this.parser.render(result, title));
            parsed_num += 1;

            if (parsed_num === file_list_len) {
                zip.generateAsync({type:"blob", compression: "DEFLATE"})
                   .then((content) => {
                       save_blob("html.zip", content);
                       this.opts.parent.trigger("aru_change", Aru.speech.md_parsing_done, Aru.expression.smile_c);
                   });
            }
        };

        if (file_list_len > 1) {
            parsed_num = 0;
            zip = JSZip();
            handle_result = handle_multiple_files;
        }
        else {
            handle_result = handle_single_file;
        }

        const handle_read = (error, result, file_name) => {
            if (result) {
                handle_result(result, file_name);

            }
            else {
                handle_read_error(error);
            }
        };

        for (var idx = 0; idx < file_list_len; idx += 1) {
            read_text_file(file_list[idx], handle_read);
        }
    };

    this.on_drop = (event) => {
        event.stopPropagation();
        event.preventDefault();
        this.parse_files(event.dataTransfer.files);
    };

    this.on_md = (event) => {
        this.parse_files(event.target.files);
    };
}

export default {
    html: HTML,
    constructor: Markdown
};
