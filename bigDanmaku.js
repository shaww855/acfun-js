// ==UserScript==
// @name         acfun超大弹幕缩小
// @version      0.1.0
// @description  超大弹幕很影响观看体验，干掉它吧！
// @author       泥壕
// @match        https://www.acfun.cn/v/*
// @namespace https://greasyfork.org/users/50175
// ==/UserScript==
 
(function () {
  'use strict';
  let timeId = null
  let count = 0
  const reduceDanmaku = () => {
    timeId = setInterval(() => {
      const dom = document.querySelectorAll('.danmaku-item.danmaku-item-move')
      Array.prototype.forEach.call(dom, e => {
        if (e.style.fontSize !== '25px') {
          count++
          window.requestAnimationFrame(() => {
            log(e.innerText)
            e.style.fontSize = '25px'
          })
        }
      })
    }, 600);
  }
  const log = arg => console.log('%c 超大弹幕缩小 ', 'background:#03a9f4;color:white', arg);
  const videoElement = document.querySelector('video')
  videoElement.addEventListener('play', () => {
    log('=开始=');
    reduceDanmaku()
  })
  videoElement.addEventListener('pause', () => {
    window.clearInterval(timeId)
    log(`=中止=  已处理${count}条超大弹幕`);
  })
})();