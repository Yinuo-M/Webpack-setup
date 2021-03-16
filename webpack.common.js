const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	entry: {
		//NOTE it is recommended to have one entry point per page
		main: "./main.js",
		details: "./details.js",
	},
	//NOTE target is "web" by default, but there's a bug that means it's overwritten by .browserslistrc, so we need to specify it here.
	target: "web",
	devServer: {
		//NOTE open index.html by default, index.html should be the name of your homepage, because this is what a browser will look for by default.
		//setting historyApiFallback changes the default opening page.
		historyApiFallback: {
			index: "/details.html",
		},
		//NOTE turns on HMR.
		hot: true,
	},
	module: {
		rules: [
			//NOTE the HTML loader changes all img tags into a require function, so the path will work when compiled. We can configure it to deal with other kinds of assets like videos.
			{
				test: /\.html$/,
				use: ["html-loader"],
			},
			//NOTE the asset management replaces file-loader. It copies assets into the dist folder.
			{
				test: /\.(jpe?g|gif|svg|png)$/,
				type: "asset/resource",
			},
		],
	},
	plugins: [
		//NOTE every HtmlWebpackPlugin object creates a HTML file. The template is the html file we want to us, chunks is the JavaScript entry point we want it to use, and filename is the final file name generated.
		new HtmlWebpackPlugin({
			template: "./main.html",
			chunks: ["main"],
			filename: "main.html",
		}),
		new HtmlWebpackPlugin({
			template: "./details.html",
			chunks: ["details"],
			filename: "details.html",
		}),
	],
};
