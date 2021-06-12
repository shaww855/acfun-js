// ==UserScript==
// @name         acfun直播自动点赞抢红包
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  进入直播间后自动点赞、抢红包。检测到直播结束自动暂停脚本减小资源消耗（每日红包有上限所以我觉得用脚本抢应该ok）
// @author       泥壕
// @match        https://live.acfun.cn/live/*
// @grant        none
// ==/UserScript==
 
(function () {
  'use strict';
 
  function ready(fn) {
    if (document.readyState != 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }
 
  const acfunHelper = {
    log: function (arg) {
      console.log('%c acfun live helper ', 'background:#03a9f4;color:white', new Date().toTimeString().split(' ')[0], arg);
    },
    like: {
      timeId: null,
      count: 0,
      do() {
        let likeBtn = document.querySelector('.like-btn')
        acfunHelper.like.timeId = setInterval(() => {
          likeBtn.click()
          acfunHelper.like.count++
          requestAnimationFrame(() => {
            document.querySelector('.live-tips').innerHTML = `已自动点击<br>${acfunHelper.like.count}次`
          })
        }, 1000 * 60 * 1)
        acfunHelper.log(`自动点赞已启动`);
      },
      cancel() {
        clearInterval(acfunHelper.like.timeId)
        acfunHelper.log(`点赞结束，累计点击${acfunHelper.like.count}次`);
      }
    },
    redpack: {
      timeId: null,
      total: 0,
      count: 0,
      do() {
        acfunHelper.redpack.timeId = setInterval(() => {
          acfunHelper.log('检查红包')
          if (document.querySelector('.redpack-entry').style.display === 'block') {
            acfunHelper.log('探测到红包')
            clearInterval(acfunHelper.redpack.timeId)
            acfunHelper.redpack.total++
            document.querySelector('.redpack-entry').click()
            let timeId = setInterval(async () => {
              acfunHelper.log('准备抢红包')
              if (document.querySelector('.gift-redpack-btn.grab') !== null && document.querySelector('.gift-redpack-btn.grab').innerText === '抢') {
                acfunHelper.log('执行抢红包')
                acfunHelper.redpack.count++
                clearInterval(timeId)
                document.querySelector('.gift-redpack-btn.grab').click()
                await setTimeout(() => {
                  acfunHelper.log(document.querySelector('.gift-redpack-account').innerHTML)
                  document.querySelector('.gift-redpack-close').click()
                  acfunHelper.log('本轮红包结束')
                  acfunHelper.redpack.do()
                }, 1000)
              }
            }, 300)
          }
        }, 1000 * 10)
      },
      cancel() {
        clearInterval(acfunHelper.redpack.timeId)
        acfunHelper.log(`抢红包结束，红包共出现${acfunHelper.redpack.total}次，点击按钮${acfunHelper.redpack.count}次`);
      }
    },
    watcher: () => {
      function close(str) {
        acfunHelper.log(str)
        clearInterval(watcherTimeId)
        acfunHelper.like.cancel()
        acfunHelper.redpack.cancel()
      }
      function watchLiveStatus() {
        acfunHelper.log('直播状态检查')
        if (document.querySelector('.live-closed.active') !== null) {
          close('直播已结束')
        }
        if (document.querySelector('.live-not-open.active') !== null) {
          close('直播未开始')
        }
      }
      watchLiveStatus()
      const watcherTimeId = setInterval(() => {
        watchLiveStatus()
      }, 1000 * 60)
    }
  }
  // document.querySelector('.gift-redpack-btn').click()
 
  ready(() => {
    acfunHelper.log('准备完成');
    setTimeout(() => {
      acfunHelper.like.do()
      acfunHelper.redpack.do()
 
      acfunHelper.watcher()
    }, 0)
  })
})();