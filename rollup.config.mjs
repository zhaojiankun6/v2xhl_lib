
import commonjs from '@rollup/plugin-commonjs'
import glob from 'glob'; // 用于匹配文件路径
import path from 'node:path'; // 用于处理文件路径
import { fileURLToPath } from 'node:url'; // 用于处理文件路径
import terser from '@rollup/plugin-terser'; // 压缩js
import VuePlugin from "rollup-plugin-vue";
// import { nodeResolve } from '@rollup/plugin-node-resolve';  // 用于处理第三方模块
import postcss from 'rollup-plugin-postcss' // 处理css文件

export default {
    input: Object.fromEntries(
        glob.sync('src/**/*.js').map(file => [
            // 这里将删除 `src/` 以及每个文件的扩展名。
            // 因此，例如 src/nested/foo.js 会变成 nested/foo
            path.relative(
                'src',
                file.slice(0, file.length - path.extname(file).length)
            ),
            // 这里可以将相对路径扩展为绝对路径，例如
            // src/nested/foo 会变成 /project/src/nested/foo.js
            fileURLToPath(new URL(file, import.meta.url))
        ])
    ),
    // input: "./src/index.js",
    type: "module",
    output: {
      format: 'es',
      dir: 'xhl-ui',
    },
    plugins:[
      // nodeResolve(),
      VuePlugin(),
      postcss({
        // extract: 'style.css', // 将css输出到指定文件里
        // minimize: true, // 压缩css
      }),
  
      commonjs(),
     
      // terser({
      //   maxWorkers: 4 // 开启多线程压缩
      // }),
    ],
    external: ['vue',
    'element-ui'
  ]
  }
  
//  https://juejin.cn/post/6934698510436859912
