module.exports = {
  // 将 examples 目录添加为新的页面
  pages: {
    index: {
      // page 的入口
      entry: "example/main.js",
      // 模板来源
      template: "public/index.html",
      // 输出文件名
      filename: "index.html"
    }
  },
  devServer: {
    proxy: {
      "^/media": {
        target: "http://192.168.10.11:88/static/0086000028_ytgg",
        changeOrigin: true,
        pathRewrite: {
          "^/media": ""
        }
      }
    }
  }
};
