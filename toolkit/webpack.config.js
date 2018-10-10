const MPXPlugin = require("mpx-webpack-plugin");
const path = require("path");
const webpack = require("webpack");
const browsers = require("./browsers.config.js");
const { DEVELOPMENT, PRODUCTION, TEST, BETA, PROD } = require("./core/vars");
const { DefinePlugin } = webpack;
const CleanWebpackPlugin = require("clean-webpack-plugin");
// const CopyWebpackPlugin = require("copy-webpack-plugin");

/// Webpack 配置文件
module.exports = ( env ) => {
    const mode = (env.mode === void 0 ? PRODUCTION : Array.isArray(env.mode) ? env.mode[env.mode.length - 1] : env.mode);
    const target = (env.target === void 0 ? (mode === PRODUCTION ? PROD : TEST) : Array.isArray(env.target) ? env.target[env.target.length - 1] : env.target);
    
    const context = path.resolve("./src/");
    const output = path.resolve("./dist/");
    const platform = MPXPlugin.platforms.WECHAT;
    
    return {
        "mode": "none",
        "cache": mode === DEVELOPMENT,
        "context": context,
        "output": {
            "filename": "[name].js",
            "path": output
        },
        "entry": "./app",
        "optimization": {
            "splitChunks": { "name": "vendors", "chunks": "all" },
            "runtimeChunk": { "name": "runtime" },
            "minimize": mode === PRODUCTION,
        },
        "resolve": {
            "alias": {
                "@assets": path.resolve(context, "assets"),
                "@uploader": path.resolve(context, "assets", "uploader"),
                "@components": path.resolve(context, "components"),
                "@core": path.resolve(context, "core"),
                "@modules": path.resolve(context, "modules"),
                "@pages": path.resolve(context, "pages"),
                "@world2d": path.resolve(context, "world2d"),
            }
        },
        "module": {
            "rules": [
                {
                    "test": /\.(jsx?|tsx?|es6|esm)(\?.*)?$/i,
                    "exclude": /node_modules[\\\/](?!(gs|ik|wxa?)\-)/i,
                    "use": [
                        { 
                            "loader": "babel-loader", 
                            "options": {
                                "babelrc": false,
                                "presets": [
                                    ["env", { "modules": false, "targets": { "browsers": browsers } }]
                                ],
                                "plugins": [
                                    "transform-object-rest-spread",
                                    "transform-decorators-legacy",
                                    "transform-class-properties",
                                    "transform-async-to-generator",
                                    ["transform-runtime", { "helpers": true, "polyfill": false, "regenerator": true }],
                                ]
                            }
                        },
                        { 
                            "loader": "preprocess-loader", 
                            "options": {
                                "ppOptions": { "type": "js" },
                                "__WEBPACK_MODE__": mode,
                                "__WEBPACK_TARGET__": target,
                                "__WEBPACK_PLATFORM__": platform,
                            }
                        }
                    ],
                },
                {
                    "test": /\.json(\?.*)?$/i,
                    "use":[
                        { "loader": "extract-loader" },
                        { "loader": MPXPlugin.loaders.JSON_LOADER }
                    ]
                },
                {
                    "test": /\.wxs(\?.*)?$/i,
                    "use": [
                        { 
                            "loader": MPXPlugin.loaders.FILE_LOADER, 
                            "options": { 
                                "name": "[name]_[hash:6].[ext]", 
                                "context": context,
                                "exportRelativePath": true,
                            } 
                        },
                        { 
                            "loader": "preprocess-loader", 
                            "options": {
                                "ppOptions": { "type": "js" },
                                "__WEBPACK_MODE__": mode,
                                "__WEBPACK_TARGET__": target,
                                "__WEBPACK_PLATFORM__": platform,
                            }
                        }
                    ]
                },
                {
                    "test": /\.(html|w?xml|a?xml|swan)(\?.*)?$/i,
                    "use": [
                        {
                            "loader": MPXPlugin.loaders.FILE_LOADER,
                            "options": {
                                "name": "[topname].[ext:html]", 
                                "context": context,
                                "exportRelativePath": true,
                            }
                        },
                        { 
                            "loader": "extract-loader" 
                        },
                        { 
                            "loader": "html-loader" ,
                            "options": { 
                                "attrs": ["image:src", "cover-image:src", "import:src", "wxs:src"],
                                "minimize": mode === PRODUCTION,
                                "caseSensitive": true,
                                "removeAttributeQuotes": false,
                                "collapseWhitespace": true,
                                "conservativeCollapse": false,
                                "minifyCSS": false,
                                "minifyJS": false,
                                "ignoreCustomFragments": [/\{\{[\s\S]*?\}\}/, /<%[\s\S]*?%>/, /<\?[\s\S]*?\?>/],
                            }
                        },
                        { 
                            "loader": "preprocess-loader", 
                            "options": {
                                "ppOptions": { "type": "html" },
                                "__WEBPACK_MODE__": mode,
                                "__WEBPACK_TARGET__": target,
                                "__WEBPACK_PLATFORM__": platform,
                            }
                        }
                    ]
                },
                {
                    "test": /\.(s?css|wxss|acss)(\?.*)?$/i,
                    "use": [
                        { 
                            "loader": MPXPlugin.loaders.FILE_LOADER, 
                            "options": { 
                                "name": "[topname].[ext:css]", 
                                "context": context,
                                "exportRelativePath": true
                            } 
                        },
                        { "loader": "extract-loader" },
                        { 
                            "loader": "css-loader", 
                            "options": { "minimize": mode === PRODUCTION } 
                        },
                        {
                            "loader": "postcss-loader",
                            "options": {
                                "config": { "path": require.resolve("./postcss.config.js") }
                            }
                        },
                        { "loader": "resolve-url-loader" },
                        { "loader": "sass-loader" },
                        { 
                            "loader": "preprocess-loader", 
                            "options": {
                                "ppOptions": { "type": "sass" },
                                "__WEBPACK_MODE__": mode,
                                "__WEBPACK_TARGET__": target,
                                "__WEBPACK_PLATFORM__": platform,
                            }
                        }
                    ]
                },
                
                { 
                    "test": /\.(?:png|svg|jpe?g|gif|bmp|webp)(\?.*)?$/i, 
                    "use": [
                        { 
                            "loader": MPXPlugin.loaders.FILE_LOADER, 
                            "options": { 
                                "name": "[name]_[hash:6].[ext]", 
                                "context": context,
                                "publicPath": "/",
                            } 
                        }
                    ]
                }
            ]
        },
        "plugins": [
            new MPXPlugin({ "platform": platform, "chunks": ["runtime", "vendors"] }),
            new DefinePlugin({
                "__WEBPACK_MODE__": JSON.stringify(mode),
                "__WEBPACK_TARGET__": JSON.stringify(target),
                "__WEBPACK_PLATFORM__": JSON.stringify(platform),
            }),
            // new CopyWebpackPlugin([
            //     { "from": path.resolve(context, "pages/index/assets"), "to": "pages/index/assets" },
            //     { "from": path.resolve(context, "pages/index/components"), "to": "pages/index/components" }
            // ]),
            mode === PRODUCTION ? new CleanWebpackPlugin([output], { "root": path.resolve("."), "exclude": ["project.config.json", "project.swan.json"] }) : null,
        ]
        .filter(Boolean)
    };
}