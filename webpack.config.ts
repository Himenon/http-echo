import * as webpack from "webpack";
import * as path from "path";

export interface Config {
  outputDir: string;
  entry: webpack.Entry;
}

export const generateConfig = (config: Config): webpack.Configuration => {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    mode: isProduction ? "production" : "development",
    entry: config.entry,
    devtool: isProduction ? false : "source-map",
    output: {
      path: config.outputDir,
      filename: "[name].js",
      library: {
        type: "commonjs",
      },
      clean: isProduction,
    },
    optimization: {
      minimize: false,
    },
    target: "node",
    resolve: {
      extensions: [".js", ".ts", ".tsx"],
    },
    module: {
      rules: [
        {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          exclude: [/__tests__/, /node_modules/],
          use: {
            loader: "swc-loader",
          },
        },
      ],
    },
    externalsPresets: { node: true }, // in order to ignore built-in modules like path, fs, etc.
  };
};

module.exports = generateConfig({
  outputDir: path.join(__dirname, "dist"),
  entry: {
    main: "./src/server.ts",
  },
});
