const path = require("path");

module.exports = {
  // Tắt React Refresh hoàn toàn ở cả Babel và Webpack
  babel: {
    loaderOptions: (babelLoaderOptions) => {
      // Loại bỏ react-refresh/babel plugin
      const plugins = babelLoaderOptions.plugins || [];
      babelLoaderOptions.plugins = plugins.filter(
        (plugin) => {
          const pluginName = Array.isArray(plugin) ? plugin[0] : plugin;
          return !pluginName || !pluginName.includes('react-refresh');
        }
      );
      return babelLoaderOptions;
    },
  },
  
  webpack: {
    configure: (webpackConfig) => {
      // Tìm và loại bỏ ReactRefreshPlugin
      webpackConfig.plugins = webpackConfig.plugins.filter(
        (plugin) => plugin.constructor.name !== 'ReactRefreshPlugin'
      );
      return webpackConfig;
    },
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "src/shared"),
      "@core": path.resolve(__dirname, "src/core"),
      "@common": path.resolve(__dirname, "src/common"),
      "@modules": path.resolve(__dirname, "src/modules"),
      "@auth": path.resolve(__dirname, "src/modules/auth"),
      "@user": path.resolve(__dirname, "src/modules/user"),
      "@message": path.resolve(__dirname, "src/modules/message"),
      "@friend": path.resolve(__dirname, "src/modules/friend"),
      "@post": path.resolve(__dirname, "src/modules/post"),
      "@notification": path.resolve(__dirname, "src/modules/notification"),
      "@components": path.resolve(__dirname, "src/shared/components"),
      "@hooks": path.resolve(__dirname, "src/shared/hooks"),
      "@utils": path.resolve(__dirname, "src/shared/utils"),
      "@contexts": path.resolve(__dirname, "src/shared/contexts"),
      "@httpClient": path.resolve(__dirname, "src/shared/httpClient"),
      "@redux": path.resolve(__dirname, "src/core/config"),
      "@store": path.resolve(__dirname, "src/core/config/store"),
    },
  },
};
