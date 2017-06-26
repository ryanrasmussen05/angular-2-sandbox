let path = require('path');
let webpack = require('webpack');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
let TsConfigPathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin;
let WebpackBrowserPlugin = require('webpack-browser-plugin');
let NgTools = require('@ngtools/webpack');
let helpers = require('./config/helpers');

let {getIfUtils, removeEmpty} = require('webpack-config-utils');

let port = 8700;

let config = function(env = {dev: true}) {

    const {ifDev, ifProd, ifAnalyze} = getIfUtils(env, ['dev', 'prod', 'analyze']);

    return {
        //bundle these as single files
        entry: {
            'polyfills': './src/polyfills.ts',
            'app': './src/app/main.ts'
        },

        module: {
            rules: [
                {
                    enforce: 'pre',
                    test: /\.ts$/,
                    include: helpers.root('src'),
                    use: ['tslint-loader']
                },
                {
                    test: /\.ts$/,
                    use: ifProd(['@ngtools/webpack'],['awesome-typescript-loader', 'angular2-template-loader'])
                },
                {
                    test: /\.html$/,
                    use: [{
                        loader: 'html-loader',
                        options: {
                            minimize: false //for tree shaking
                        }
                    }]
                },
                {
                    test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico|json)$/,
                    use: ['file-loader?name=assets/[hash].[ext]']
                },
                {
                    test: /\.scss$/,
                    include: helpers.root('src', 'app'),
                    use: ['to-string-loader', 'css-loader', 'resolve-url-loader', 'sass-loader?sourceMap']
                },
                {
                    test: /\.scss$/,
                    exclude: helpers.root('src', 'app'),
                    use: ExtractTextPlugin.extract({use: 'css-loader!resolve-url-loader!sass-loader?sourceMap'})
                },
                {
                    test: /\.css$/,
                    use: ['raw-loader']
                }
            ]
        },
        output: {
            path: path.resolve('./dist'),
            filename: '[name].js',
            sourceMapFilename: '[file].map'
        },
        plugins: removeEmpty([
            new HtmlWebpackPlugin({
                title: 'Ryan Rasmussen',
                template: 'src/index.ejs',
                favicon: 'src/public/images/favicon.ico',
                chunksSortMode: orderByList(['polyfills', 'app'])
            }),
            new webpack.ProvidePlugin({
                Physics: 'physicsjs'
            }),
            new ExtractTextPlugin('[name].css'),
            new webpack.ContextReplacementPlugin(
                /angular(\\|\/)core(\\|\/)@angular/, path.resolve('./src'), {}
            ),
            new webpack.DefinePlugin({
                'process.env': {ENV: JSON.stringify(ifProd('production', 'dev'))}
            }),
            ifProd(new webpack.optimize.UglifyJsPlugin({ // https://github.com/angular/angular/issues/10618
                mangle: {
                    keep_fnames: true
                }
            })),
            ifProd(new NgTools.AotPlugin({
                "tsConfigPath": path.resolve('./tsconfig.json')
            })),
            ifAnalyze(new BundleAnalyzerPlugin()),
            ifDev(new WebpackBrowserPlugin({
                port: port,
                browser: 'Chrome'
            }))
        ]),
        resolve: {
            extensions: ['.ts', '.js'],
            modules: [path.resolve('./', 'node_modules')],
            plugins: [
                new TsConfigPathsPlugin(/* { tsconfig, compiler } */)
            ]
        },
        devServer: {
            historyApiFallback: true,
            inline: true,
            port: port
        },
        devtool: ifProd('source-map', 'cheap-module-inline-source-map')
    };
};

function orderByList(list) {
    return function(chunk1, chunk2) {
        let index1 = list.indexOf(chunk1.names[0]);
        let index2 = list.indexOf(chunk2.names[0]);
        if (index2 === -1 || index1 < index2) {
            return -1;
        }
        if (index1 === -1 || index1 > index2) {
            return 1;
        }
        return 0;
    };
}

module.exports = config;
