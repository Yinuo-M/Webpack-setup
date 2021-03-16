//NOTE we use as few plugin as possible to speed up the build speed during development.

const path = require("path");
const common = require("./webpack.common");
const { merge } = require("webpack-merge");

//NOTE the merge methods merges this file with webpack.common - configs shared between dev and prod.
module.exports = merge(common, {
	mode: "development",
	output: {
		filename: "[name].js",
		//NOTE output.path only taks absolute path, so we need to use the resolve method here.
		path: path.resolve(__dirname, "dist"),
		//NOTE assetModuleFilename tells asset management which path to copy the assets in. It is in relation to the dist folder. [ext] includes the dot, e.g. ".jpn".
		assetModuleFilename: "assets/[name][ext]",
	},
	//NOTE eval-source-map is the recommended source map for development.
	devtool: "eval-source-map",
	//currently there's a bug with HMR for multiple entries on the same page, only the last entry will reload. Adding runtimeChunk:"single" solves this problem. For details see Github
	//optimization: {
		//Using runtimeChunk: "single" is recommended for multiple entry points on a single HTML page. But you should only have one entry point a page in most cases.
	//	runtimeChunk: "single",
	//},
	module: {
		rules: [
			//NOTE loaders are applied in reverse order. Css-loader turns css into a JavaScript readable string, and style-loader injects that into the <head> element using JavaScript.
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"],
			},
		],
	},
});
