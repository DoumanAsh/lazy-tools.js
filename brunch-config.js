module.exports = {
    files: {
        javascripts: {
            joinTo: 'app.js'
        },
        stylesheets: {
            joinTo: 'style.css'
        }
    },

    conventions: {
        ignored: [
            '_*.*',
            'app/templates/**',
            'test/**/*.js'
        ],
        assets: [
            /^app\/assets/,
            'app/templates/',
            'app/templates/[a-zA-Z0-9]*.jade',
        ],
    },

    plugins: {
        babel: {
            presets: ['es2015'],
            pattern: /^app\/.*\.js$/
        },
        stylus: {
            includeCss: true,
            plugins: ['autoprefixer-stylus']
        },
        eslint: {
            pattern: /^app\/.*\.js$/,
            warnOnly: true
        },
        jade: {
            staticBasedir: 'app/templates',
            noRuntime: true
        }
    }
};
