const path = require("path");
const fs = require("fs");
var HTMLWebpackPlugin = require("html-webpack-plugin");
var CopyPlugin = require('copy-webpack-plugin');

// List all files in a directory in Node.js recursively in a synchronous fashion
// https://gist.github.com/kethinov/6658166#gistcomment-1976458
const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach((file) => {
    filelist = fs.statSync(path.join(dir, file)).isDirectory()
      ? walkSync(path.join(dir, file), filelist)
      : filelist.concat(path.join(dir, file));
  });
  return filelist;
};

const dir = "src/pages";
const pages = walkSync(dir).map((el) => el.slice(dir.length + 1));

console.log(pages);

module.exports = {
  entry: {
    index: "./src/index.js",
    content: "./src/js/content.js",
    team: "./src/js/team.js",
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  devtool: "none", // avoid eval statements
  // https://stackoverflow.com/questions/44557802/how-to-create-multiple-pages-in-webpack
  plugins: [
    new HTMLWebpackPlugin({
      filename: "index.html",
      template: "./src/index.pug",
      excludeChunks: ["content", "team"],
      favicon: './src/assets/favicons/favicon.ico'
    }),
    ...pages.map(
      (page) =>
        new HTMLWebpackPlugin({
          template: "./src/pages/" + page,
          filename: page.slice(0, -4) + "/index.html",
          excludeChunks: ["index", "team"],
          favicon: './src/assets/favicons/favicon.ico'
        })
    ),
    new HTMLWebpackPlugin({
      filename: "Team_Members/index.html",
      template: "./src/pages/Team_Members.pug",
      excludeChunks: ["index", "content"],
      favicon: './src/assets/favicons/favicon.ico'
    }),
    new CopyPlugin({
      patterns: [
        {
          from: './src/assets/unity/*',
          to: 'assets/unity',
          flatten: true,
        },
        {
          from: './src/assets/unity/img/*',
          to: 'assets/unity/img',
          flatten: true,
        },
        {
          from: './src/assets/unity/css/*',
          to: 'assets/unity/css',
          flatten: true,
        },
        {
          from: './src/assets/unity/js/*',
          to: 'assets/unity/js',
          flatten: true,
        },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.pug$/,
        use: ["pug-loader"],
      },
    ],
  },
  resolve: {
    alias: {
      Assets: path.resolve(__dirname, "src/assets")
    }
  }
};
