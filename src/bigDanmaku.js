// ==UserScript==
// @name         acfun超大弹幕缩小
// @version      0.2.0
// @description  超大弹幕很影响观看体验，干掉它吧！
// @author       泥壕
// @match        https://www.acfun.cn/v/*
// @namespace https://greasyfork.org/users/50175
// ==/UserScript==

(function () {
  'use strict';
  const log = arg => console.log('%c 超大弹幕缩小 ', 'background:#03a9f4;color:white', arg);
  let wentDel = Boolean(localStorage.getItem('超大弹幕处理方式'))
  log(`欢迎使用~  当前配置：超大弹幕 ${wentDel ? '删除' : '缩小'}`)
  log(`运行 bigDanmakuDel(true) 删除超大弹幕，运行 bigDanmakuDel(false) 缩小超大弹幕。`)
  let timeId = null
  let count = 0
  const reduceDanmaku = () => {
    timeId = setInterval(() => {
      const dom = document.querySelectorAll('.danmaku-item.danmaku-item-move')
      Array.prototype.forEach.call(dom, e => {
        if (parseInt(e.style.fontSize) > 25) {
          count++
          window.requestAnimationFrame(() => {
            log(e.innerText)
            if (wentDel) {
              e.remove()
            } else {
              e.style.fontSize = '25px'
            }
          })
        }
      })
    }, 600);
  }
  const videoElement = document.querySelector('video')

  videoElement.addEventListener('play', () => {
    log('=开始=');
    reduceDanmaku()
  })
  videoElement.addEventListener('pause', () => {
    window.clearInterval(timeId)
    log(`=中止=  共处理${count}条超大弹幕`);
  })

  window.bigDanmakuDel = action => {
    wentDel = action
    log(`配置修改：超大弹幕 ${wentDel ? '删除' : '缩小'}`)
    if (action) {
      localStorage.setItem('超大弹幕处理方式', 1)
    } else {
      localStorage.removeItem('超大弹幕处理方式')
    }
  }
})();