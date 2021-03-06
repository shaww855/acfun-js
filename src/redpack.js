// ==UserScript==
// @name         自动抢红包
// @namespace    http://tampermonkey.net/
// @version      0.1.12
// @description  自动抢红包
// @author       泥壕
// @match        https://live.acfun.cn/live/*
// @icon         https://cdn.aixifan.com/ico/favicon.ico
// @grant        none
// ==/UserScript==

(function () {
  'use strict';
  function ready (fn) {
    if (document.readyState != 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  // https://dsb123dsb.github.io/2017/05/02/JavaScript%E7%9B%91%E5%90%AC%E5%85%A8%E9%83%A8Ajax%E8%AF%B7%E6%B1%82%E4%BA%8B%E4%BB%B6%E7%9A%84%E6%96%B9%E6%B3%95/
  function ajaxEventTrigger (event) {
    var ajaxEvent = new CustomEvent(event, { detail: this });
    window.dispatchEvent(ajaxEvent);
  }

  var oldXHR = window.XMLHttpRequest;

  function newXHR () {
    var realXHR = new oldXHR();
    // this指向window
    realXHR.addEventListener('abort', function () { ajaxEventTrigger.call(this, 'ajaxAbort'); }, false);
    realXHR.addEventListener('error', function () { ajaxEventTrigger.call(this, 'ajaxError'); }, false);
    realXHR.addEventListener('load', function () { ajaxEventTrigger.call(this, 'ajaxLoad'); }, false);
    realXHR.addEventListener('loadstart', function () { ajaxEventTrigger.call(this, 'ajaxLoadStart'); }, false);
    realXHR.addEventListener('progress', function () { ajaxEventTrigger.call(this, 'ajaxProgress'); }, false);
    realXHR.addEventListener('timeout', function () { ajaxEventTrigger.call(this, 'ajaxTimeout'); }, false);
    realXHR.addEventListener('loadend', function () { ajaxEventTrigger.call(this, 'ajaxLoadEnd'); }, false);
    realXHR.addEventListener('readystatechange', function () { ajaxEventTrigger.call(this, 'ajaxReadyStateChange'); }, false);
    return realXHR;
  }

  window.XMLHttpRequest = newXHR;

  let 待抢红包个数 = 0
  let 检查红包记录 = []
  let 抢红包结果记录 = []
  let 执行抢红包超时的计时器 = null
  let 等待红包倒计时的计时器 = 0
  let barkLocalKey = 'acfun_redpack_bark'
  const markLocalKey = 'acfun_redpack_key'
  const markDate = () => {
    const date = new Date()
    return `${date.getMonth() + 1}-${date.getDate()}`
  }

  // {"result":1,"data":{"grabbed":false,"amount":0},"host":"public-sc-kcs-node1780.idcyz.hb1.kwaidc.com"}
  // {"result": 1,"data": {"grabbed": true,"amount": 1},"host": "public-af-rs-kce-node372.idczw.hb1.kwaidc.com"}

  const 抢红包 = () => {
    clearInterval(执行抢红包超时的计时器)
    // redpack-entry
    const 观众红包 = document.querySelector('.redpack-entry')
    // authpack-entry
    const 主播红包 = document.querySelector('.authpack-entry')
    let 红包DOM = null
    if (观众红包.style.display === 'block') {
      红包DOM = 观众红包.querySelector('.lucky-cat')
      console.log('观众红包');
    } else {
      红包DOM = 主播红包.querySelector('.lucky-cat')
      console.log('主播红包');
    }
    红包DOM.click()
    const 倒计时按钮 = document.querySelector('.countdown')
    let 抢红包hack = 0
    clearInterval(等待红包倒计时的计时器)
    等待红包倒计时的计时器 = setInterval(() => {
      抢红包hack += .5
      if (抢红包hack >= 30) {
        console.log('等待红包倒计时超时，取消本次抢红包');
        clearInterval(等待红包倒计时的计时器)
        clearInterval(执行抢红包超时的计时器)
        if (待抢红包个数 > 0) {
          待抢红包个数--
        } else {
          待抢红包个数 = 0
        }
        return
      }

      const 倒计时文本 = 倒计时按钮.textContent
      console.log('红包倒计时', 倒计时文本);
      if (倒计时文本 === '抢') {
        clearInterval(等待红包倒计时的计时器)
        clearInterval(执行抢红包超时的计时器)
        执行抢红包超时的计时器 = setInterval(() => {
          console.log('点击倒计时按钮', 倒计时按钮);
          document.querySelector('.gift-redpack-btn').click()
          document.querySelector('.gift-authpack-btn').click()
        }, 300)
        setTimeout(() => {
          clearInterval(执行抢红包超时的计时器)
        }, 10000)
      }
    }, 500)
    console.log('点击右上角抢红包按钮');
  }

  const 暂停今日红包相关操作 = () => {
    localStorage.setItem(markLocalKey, markDate())
  }

  const 今日可以继续抢红包 = () => {
    const cache = localStorage.getItem(markLocalKey)
    if (cache === markDate()) {
      return false
    } else {
      return true
    }
  }

  const 监听异步请求 = e => {
    const 请求对象 = e.detail
    const 请求完成 = 请求对象.readyState === 4
    if (请求完成) {
      // console.log('请求完成', e.detail.response);
      try {
        const res = JSON.parse(请求对象.responseText)
        const 能否抢红包 = 请求对象.responseURL.includes('/web/redpack/getToken?subBiz=mainApp&kpn=ACFUN_APP&kpf=PC_WEB&')
        if (能否抢红包) {
          // 发送红包通知()
          待抢红包个数++
          console.log('能否抢红包？', res.data.canRequest);
          console.log('服务器要求等待', res.data.delayTimeMs, 'ms');
          检查红包记录.push(res)
          抢红包()
        }
        const 抢红包结果 = 请求对象.responseURL.includes('/web/redpack/grab?subBiz=mainApp&kpn=ACFUN_APP&kpf=PC_WEB&')
        if (抢红包结果) {
          console.log('抢红包结果', res);
          if (res.result === 380067) {
            console.log(res.error_msg);
            暂停今日红包相关操作()
          }

          待抢红包个数--
          clearInterval(执行抢红包超时的计时器)
          抢红包结果记录.push(res)
          document.querySelector('.gift-authpack-close').click()
          document.querySelector('.gift-redpack-close').click()

          if (res.error_msg && res.error_msg === '抢红包次数超过给定次数') {
            查询红包记录()
            window.removeEventListener('ajaxReadyStateChange', 监听异步请求);
          } else {
            if (待抢红包个数 > 0) {
              console.log(`仍有${待抢红包个数}个红包`);
              抢红包()
            }
          }
        }
      } catch (error) {
        console.log('解析结果失败', error);
      }
    }
  }

  window.addEventListener('ajaxReadyStateChange', 监听异步请求);

  function 检查直播状态 () {
    console.log('直播状态检查')
    if (document.querySelector('.live-closed.active') !== null) {
      结束脚本('直播已结束')
    }
    if (document.querySelector('.live-not-open.active') !== null) {
      结束脚本('直播未开始')
    }
  }

  const 查询红包记录 = () => {
    // const 失败个数 = 抢红包结果记录.filter(e => e.error_msg && e.error_msg === '抢红包次数超过给定次数').length
    const sum = 抢红包结果记录.filter(e => e.data && e.data.grabbed).map(e => e.data.amount).reduce((acc, cur) => acc += cur, 0)
    console.log(`共${检查红包记录.length}个，${sum}ac币`, 抢红包结果记录);
  }

  function 结束脚本 (msg) {
    console.log('结束脚本', msg);
    clearInterval(检查直播状态计时器)
    clearInterval(执行抢红包超时的计时器)
    clearInterval(点赞定时器)
    console.log(`点赞${点赞次数}次`);
    查询红包记录()
  }
  window.redpackCheck = 查询红包记录

  const 检查直播状态计时器 = setInterval(() => {
    检查直播状态()
  }, 1000 * 60)

  function 发送红包通知 () {
    let barkKey = localStorage.getItem(barkLocalKey)
    if (barkKey === null) {
      const input = prompt('输入你的Bark密钥')
      if (input === '') {
        alert('密钥不能为空')
        发送红包通知()
      } else if (input === null) {
        return
      } else {
        localStorage.setItem(barkLocalKey, input)
        barkKey = input
      }
    }
    const message = `主播：${document.querySelector('.up-name').textContent}\n${document.querySelector('.gift-redpack-title').textContent}\n${document.querySelector('.gift-redpack-account').textContent}`
    const url = location.href
    const headUrl = document.querySelector('.live-author-avatar-img').src
    let path = encodeURI(`/${barkKey}/AcFun红包通知/${message.replace('/', '')}?url=${url}&group=acfun&icon=${headUrl}&sound=alarm`)

    fetch(
      `https://api.day.app${path}`,
      { method: 'get' }
    ).then(res => {
      if (res.status === 200) {
        console.log('红包Bark通知发送成功');
      }
    }).catch(err => {
      console.log('红包Bark通知发送失败');
      console.log(error)
    })

  }

  function handleDomChange () {
    // 选择需要观察变动的节点
    const redpackEntry = document.querySelector('.redpack-entry')
    const authpack = document.querySelector('.authpack-entry')

    // 观察器的配置（需要观察什么变动）
    const config = { attributes: true, childList: false, subtree: false };

    // 当观察到变动时执行的回调函数
    const callback = function (mutationsList, observer) {
      // Use traditional 'for loops' for IE 11
      for (let mutation of mutationsList) {
        if (mutation.type === 'attributes') {
          console.log('检测到红包DOM改动', mutation.attributeName, '今日可以继续抢红包', 今日可以继续抢红包());
          if (redpackEntry.style.display === 'block' && 今日可以继续抢红包()) {
            发送红包通知()
          }
          if (authpack.style.display === 'block') {
            发送红包通知()
          }
        }
      }
    };

    // 创建一个观察器实例并传入回调函数
    const observer = new MutationObserver(callback);

    // 以上述配置开始观察目标节点
    observer.observe(redpackEntry, config);
    observer.observe(authpack, config);
  }

  let 点赞次数 = 0
  let 点赞定时器 = 0
  ready(() => {
    const 点赞按钮 = document.querySelector('.like-btn')
    const 点赞提示 = document.querySelector('.live-tips')
    点赞定时器 = setInterval(() => {
      点赞按钮.click()
      点赞次数++

      console.log(`点赞${点赞次数}次`);
      点赞提示.innerHTML = `已自动点击<br>${点赞次数}次`
    }, 1000 * 60 * .5)
  })

  window.console.error = function (str, num) {
    if (str === 'retryTicket已达最大次') {
      location.reload()
    }
  }

  setTimeout(() => {
    handleDomChange()
  }, 1000 * 30)

})();

