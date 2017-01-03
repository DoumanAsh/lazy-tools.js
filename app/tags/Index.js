'use strict';
import * as riot from 'riot';
import riot_route from 'riot-route';

import Markdown from './Markdown.js';
import Home from './Home.js';
import NotFound from './404.js';

const HTML = `
<div class="wrap">

<nav>
    <a href="#" class="{this.state.router.is_selected('')}" >Home</a>
    <a href="#md" class="{this.state.router.is_selected('md')}" >Markdown Parser</a>
</nav>

<app ref="child"></app>

<div class="aru">
    <img src="{this.state.aru.img}"/>
    <p>{this.state.aru.speech}</p>
</div>

</div>
`;

const Aru = {
    expression: {
        "norm": "/img/aru-norm-1.png",
        "sad": "/img/aru-sad-1.png",
        "smile": "/img/aru-smile-1.png",
        "smile_c": "/img/aru-smile_c-1.png"
    },
    speech: {
        "welcome": "Welcome, Master. My name is Aru and I'll be your guide here.",
        "welcome_md": "You can use this tool to generate HTML from Markdown files. Drag and Drop your files over there.",
        "lost": "Did you take a wrong turn? Please use navigation panel at your left."
    }
};

const Apps = {
    '': {
        tag: Home,
        aru: {
            speech: "welcome",
            expression: "norm"
        }
    },
    'md': {
        tag: Markdown,
        aru: {
            speech: "welcome_md",
            expression: "norm"
        }
    },
    'not_found': {
        tag: NotFound,
        aru: {
            speech: "lost",
            expression: "sad"
        }
    }
};

function Index() {
    // Holds current state of tag.
    this.state = {
        router: {
            current: "",
            is_selected: function(name) {
                return name === this.current ? 'selected' : '';
            }
        },
        aru: {
            img: Aru.expression.norm,
            speech: Aru.speech.welcome,
            change: function(speech, expression) {
                this.speech = Aru.speech[speech];
                if (expression) this.img = Aru.expression[expression];
            }
        }
    };

    /**
     * Unmounts child element.
     *
     * @note First time it does nothing as nothing is supposed to be mounted.
     * @return {void}
     */
    this.unmount_app = () => {
        this.unmount_app = () => {
            //First element points to DOM, the second points to acual tag.
            this.refs.child[1].unmount('true');
        };
    };

    /**
     * Mounts child element.
     *
     * It creates tag and performs mount.
     * Aru state is updated.
     *
     * @param {String} hash Determines type of child. If unknown then not_found is used.
     * @return {void}
     */
    this.mount_app = (hash) => {
        const app_data = hash in Apps ? Apps[hash] : Apps.not_found;
        const {tag: tag_data, aru: aru_data} = app_data;

        this.unmount_app();

        riot.tag('app', tag_data.html, tag_data.constructor);
        riot.mount('app', {
            parent: this //USE trigger() to update parent from child.
        });

        this.state.aru.change(aru_data.speech, aru_data.expression);
    };

    this.on('mount', () => {
        riot_route((hash) => {
            this.state.router.current = hash;
            this.mount_app(hash);
            this.update();
        });
        riot_route.start(true);
    });

    this.on('unmount', () => {
        riot_route.stop();
    });
}

export default {
    name: 'Index',
    html: HTML,
    constructor: Index
};
