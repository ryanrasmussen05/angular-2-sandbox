var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var helpers = require('./helpers');

module.exports = {
    //bundle these as single files
    entry: {
        'polyfills': './src/polyfills.ts',
        'vendor': './src/vendor.ts',
        'app': './src/app/main.ts'
    },

    resolve: {
        extensions: ['.ts', '.js']
    },

    module: {
        rules: [
            //run lint on ts files first
            {
                enforce: 'pre',
                test: /\.ts$/,
                loader: 'tslint-loader'
            },
            //angular2-template-loader: replace templateUrl and styleUrls with require statements
            //awesome-typescript-loader: transpiles typescript (faster than ts-loader)
            {
                test: /\.ts$/,
                loaders: ['awesome-typescript-loader', 'angular2-template-loader']
            },
            //html-loader: exports html files as strings
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            //file-loader: bundle files
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico|json)$/,
                loader: 'file-loader?name=assets/[name].[hash].[ext]'
            },
            //raw-loader: load file as string
            //can't use raw loader because css loader resolves image urls, but does not spit out css string like sass loader does
            //load sass styles tied to specific angular component
            {
                test: /\.scss$/,
                include: helpers.root('src', 'app'),
                loaders: ['exports-loader?module.exports.toString()', 'css-loader', 'sass-loader?sourceMap']
            },
            //load app wide sass styles
            {
                test: /\.scss$/,
                exclude: helpers.root('src', 'app'),
                loader: ExtractTextPlugin.extract({loader: 'css-loader?sourceMap!sass-loader?sourceMap'})
            },
            //load global css files (semantic)
            {
                test: /\.css$/,
                exclude: helpers.root('src', 'app'),
                loader: ExtractTextPlugin.extract({loader: 'css-loader?sourceMap'})
            }
        ]
    },

    plugins: [
        // Workaround for angular/angular#11580
        new webpack.ContextReplacementPlugin(
            // The (\\|\/) piece accounts for path separators in *nix and Windows
            /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
            helpers.root('./src'), // location of your src
            {} // a map of your routes
        ),

        //make sure dependencies aren't duplicated among bundles
        new webpack.optimize.CommonsChunkPlugin({
            name: ['app', 'vendor', 'polyfills']
        }),

        //automatically inject bundles into index.html
        new HtmlWebpackPlugin({
            favicon: 'src/public/images/favicon.ico',
            template: 'src/index.html'
        }),

        //allow modules to access jquery
        new webpack.ProvidePlugin({
            jQuery: 'jquery',
            $: 'jquery',
            jquery: 'jquery',
            Physics: 'physicsjs'
        })
    ]
};
