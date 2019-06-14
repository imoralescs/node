const path = require('path')
const glob = require('glob')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const NodeExternals = require('webpack-node-externals')

const {
    NODE_ENV = 'production'
} = process.env 

const getEntries = function(pattern) {
    const entries = {}
    
    glob.sync(pattern).forEach((file) => {
        entries[file.replace('src/', '')] = path.join(__dirname, file)
    })
    
    return entries
}

const pug = {
    test: /\.pug$/,
    use:[{
        loader: 'html-loader',
        options: {
            minimize: false,
            removeComments: false,
            collapseWhitespace: false
        }
    },
    {
        loader: 'pug-html-loader'
    }]
}

const babel = {
    test: /\.js?$/,
    exclude: /node_modules/,
    use: {
        loader: 'babel-loader',
        options: {
            presets: ['@babel/preset-env'],
            plugins: [
                '@babel/plugin-transform-runtime'
            ]
        }
    }
}

// Generate list page of HtmlWebpackPlugin
const pages = fs
    .readdirSync(path.resolve(__dirname, 'src/views'))
    .filter(fileName => fileName.endsWith('.pug'))

module.exports = {
    mode: NODE_ENV,
    target: 'node',
    node: {
        __filename: true,
        __dirname: true
    },
    externals: [
        { express: 'commonjs express' },
        NodeExternals()
    ],
    devtool: 'sourcemap',
    entry: getEntries('src/**/*.js'),
    output: {
        filename: '[name]',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [babel, pug]
    },
    plugins: [
        ...pages.map((page) => {
            const temp = page.split('.').slice(0, -1).join('.');
            return new HtmlWebpackPlugin({
                filename: `../dist/public/${temp}.html`,
                template: `src/views/${page}`,
                inject: false,
                minify: false
            });
        })
    ]
}