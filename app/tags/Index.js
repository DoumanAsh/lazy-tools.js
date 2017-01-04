'use strict';
import * as riot from 'riot';
import riot_route from 'riot-route';

import Markdown from './Markdown.js';
import Home from './Home.js';
import NotFound from './404.js';

import Aru from './data/Aru.js';

const Apps = {
    '': {
        tag: Home,
        aru: {
            speech: Aru.speech.welcome,
            expression: Aru.expression.norm
        }
    },
    'md': {
        tag: Markdown,
        aru: {
            speech: Aru.speech.welcome_md,
            expression: Aru.expression.norm
        }
    },
    'not_found': {
        tag: NotFound,
        aru: {
            speech: Aru.speech.lost,
            expression: Aru.expression.sad
        }
    }
};

const AppLinks = [
    {
        ref: "#md",
        name: "Markdown Parser",
        desc: "Allows you to generate HTML files from Markdown"
    },
];

const HTML = `
<nav>
    <a href="#" class="{this.state.router.is_selected('')}" >Home</a>
    <a href="{ref}" class="{parent.state.router.is_selected(ref.slice(1))}" each={this.store.app_links}>{name}</a>
</nav>

<app ref="child"></app>

<div class="aru">
    <img src="{this.state.aru.img}"/>
    <p>{this.state.aru.speech}</p>
</div>
`;


function Index() {
    //Supposed to be immutable.
    this.store = {
        app_links: AppLinks,
    };
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
                this.speech = speech;
                if (expression) this.img = expression;
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

    this.on('aru_change', (speech, expression) => {
        this.state.aru.change(speech, expression);
        this.update();
    });
}

export default {
    name: 'Index',
    html: HTML,
    constructor: Index
};
