'use strict';
import * as riot from 'riot';
import Index from './tags/Index.js';

function riot_tag(tag_data) {
    riot.tag(tag_data.name, tag_data.html, tag_data.constructor);
}

riot_tag(Index);

riot.mount('Index', {
    title: 'Lazy-Tools'
});
