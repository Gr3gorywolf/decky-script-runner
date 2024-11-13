import deckyPlugin from "@decky/rollup";
import resolve from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
export default deckyPlugin({
  // Add your extra Rollup options here
  plugins: [
    resolve(),
    postcss({
      extensions: ['.css']
    }),
  ],
})
