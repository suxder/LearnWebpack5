// 想要webpack打包资源，必须显式引入该资源
import './css/index.css'

document.getElementById("btn").onclick = function () {
  console.log("click");
  // eslint会对动态导入语法报错，需要修改eslint配置文件
  // webpackChunkName: "math"：这是webpack动态导入模块命名的方式（webpack魔法命名）
  // "math"将来就会作为[name]的值显示。
  import(/* webpackChunkName: "math" */ "./js/math.js").then(({ mul }) => {
    console.log(mul(2, 3));
  });
};

