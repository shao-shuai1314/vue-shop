const prouPlugins = []
if(process.env.NODE_ENV === 'production'){
  prouPlugins.push("transform-remove-console")
}
module.exports = {
  "presets": [
    "@vue/cli-plugin-babel/preset"
  ],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ],
    // 发布产品时候插件数组
    ...prouPlugins,
    "@babel/plugin-syntax-dynamic-import"
  ]

}