const path = require('path')

module.exports = {
  pages: {
    index: {
      // page 的入口
      entry: path.join(__dirname, 'src/renderer/main/index.js'),
      // 模板来源
      template: 'public/index.html',
      // 在 dist/index.html 的输出
      filename: 'index.html',
      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: '影视管理',
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      // chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
    setting: {
      // page 的入口
      entry: path.join(__dirname, 'src/renderer/setting/index.js'),
      // 模板来源
      template: 'public/index.html',
      // 在 dist/index.html 的输出
      filename: 'setting.html',
      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: '偏好设置',
    },
  },
  configureWebpack: {
    // entry: path.join(__dirname, 'src/renderer/main.js'),
    resolve: {
      alias: {
        '@': path.join(__dirname, 'src/renderer/main'),
        'setting@': path.join(__dirname, 'src/renderer/setting')
      },
      extensions: [".ts", ".tsx", '.js', '.vue', '.json', '.css']
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                // https://github.com/TypeStrong/ts-loader#happypackmode
                // 必须启用happyPackMode, 否则由于webpack5的loaderContext._module属性不存在将导致构建命令无法正确执行
                happyPackMode: true,
                transpileOnly: true,
                appendTsxSuffixTo: [/\.vue$/]
              },
            }
          ],
        }
      ]
    },
    plugins: []
  },
  chainWebpack: config => {
    return config
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: 'true',  // false __dirname error
      experimentalNativeDepCheck: true,
      externals: [],
      "build": {
        "files": [
          "build",
          "!node_modules",
          "node_modules/electron-is-dev"
        ]
      },
      builderOptions: {
        "appId": "com.electron.easy-movie",
        "artifactName": "${productName}_Setup_${version}_${platform}-${arch}.${ext}",
        win: {
          "target": [{
            "target": "nsis",
            "arch": [
              "ia32",
              "x64"
            ]
          }],
          "rfc3161TimeStampServer": "http://tsa.startssl.com/rfc3161",
          "signDlls": true,
          icon: './build/icons/256x256.png',
        },
        "extraResources": [],
        "nsis": {
          "include": "build/installer.nsh",
          "oneClick": false,
          "allowElevation": true,
          "allowToChangeInstallationDirectory": true,
          "createDesktopShortcut": true
        },
      },
      outputDir: 'dist_electron',
    }
  }
}