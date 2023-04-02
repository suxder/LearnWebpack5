// 想要webpack打包资源，必须显式引入该资源
// 完整引入
// import "core-js"
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

// 添加promise代码
const promise = Promise.resolve();
promise.then(() => {
  console.log("hello promise");
});

const arr = [1,2,3]
console.log(arr.includes(1))

// 判断PWA是否成功开启
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}

