    
    nvm install 16
    nvm use 16
    npm install @vue/cli -g
    npm install @vue/cli-service -g
    npm install electron -g
    vue create esay-movie
    cd esay-movie
    vue add electron-builder
    npm install --save-dev electron-icon-builder
    npm install node-pre-gyp -g
    npm install node-gyp -g
    npm config set msvs_version 2015
    npm config set python C:/Python27/python.exe
    npm install --global --production windows-build-tools --vs2015
    electron -v
    npm install sqlite3 --build-from-source --runtime=electron --target=16.0.0 --dist-url=https://atom.io/download/electrone

## electron:serve注意事项
    可以使用webpack5
## electron:build构建注意事项

    vue-cli-plugin-electron-builder 只支持 webpack4
    所以构建时只能使用ts-loader@9以下版本，因为webpack4不支持loaderContext.getOptions()及loaderContext._module

