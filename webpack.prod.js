//NOTE syntax like {merge} uses destructuring assignment from ES6

const path = require("path");
const common = require("./webpack.common");
const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
	.BundleAnalyzerPlugin;
const { GenerateSW } = require("workbox-webpack-plugin");

module.exports = merge(common, {
	mode: "production",
	output: {
		//NOTE [contenthash] generates a hash that changes everytime a file content has changed. It's different from [hash].
		filename: "[name].[contenthash].js",
		path: path.resolve(__dirname, "dist"),
		assetModuleFilename: "assets/[name].[contenthash][ext]",
		//NOTE clean:true get rid of old, redundant files in the dist folder everytime the project is built.
		clean: true,
	},

	optimization: {
		//NOTE setting moduleIds to deterministic allow better long-term caching
		moduleIds: "deterministic",
		//NOTE CssMinimizerPlugin minifies CSS. TerserPlugin minifies JavaScript. It is automatically applied, but adding to minimizer will overwrite it. So we need to add it back.
		minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
		//splitChunks: {
		//chunks: "all", //NOTE chunks: "all" is essential to include both sync and async modules.
		//cacheGroups: {
		//NOTE This is to separate third-party packages from your own code, to help with caching. Only do this for key libraries that can't be dynamically imported to avoid creating a gigantic vendors bundle, e.g. react, bootstrap.
		//vendor: {
		//	test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
		//	name: "vendor",
		//},
		/*This is for separating shared components and libraries within your own codebase, for details see https://blog.logrocket.com/guide-performance-optimization-webpack/
				common: {
					test: /[\\/]src[\\/]components[\\/]/,
					name: "common",
				},*/
		//},
		//},

		//NOTE this separate the webpack manifest into a separate file, saving the browser multiple network requests.
		runtimeChunk: {
			name: "manifest",
		},
	},
	plugins: [
		//NOTE the filename determines what the name of the extracted css will be.
		new MiniCssExtractPlugin({ filename: "[name].[contenthash].css" }),
		//NOTE BundleAnalyzerPlugin generates an analysis webpack everytime the project is built. You can inspect the size and composition of your project there.
		new BundleAnalyzerPlugin(),
		//NOTE this generates a service worker, using the workbox-webpack-plugin. The two settings help it to run sooner and faster.
		new GenerateSW({ clientsClaim: true, skipWaiting: true }),
	],
	module: {
		rules: [
			//NOTE bable-loader enables babel.
			{
				test: /\.m?js$/,
				exclude: /node_modules/,
				use: ["babel-loader"],
			},
			//NOTE MiniCssExtractPlugin extracts each CSS into a separate CSS file, instead of injecting them into the DOM like styleloader does. This avoids blinking.
			{
				test: /\.css$/,
				use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
			},
		],
	},
});
