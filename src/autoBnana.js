// ==UserScript==
// @name         acfun自动投蕉
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  已关注up主的视频、文章自动投5蕉，无任何依赖，原生操作
// @author       泥壕
// @match        https://www.acfun.cn/v/*
// @match        https://www.acfun.cn/a/*
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
  /**
   * 吃我大蕉
   */
  function bananaEat () {
    document.querySelector('.banana[data-num="5"]').click()
    console.log('= auto banana done =');
  }
  ready(() => {
    if (location.href.includes('/v/')) {
      // 视频页面
      if (document.querySelector('.follow-up').className.includes('followed')) {
        // 已关注
        if (document.querySelector('.action-area .banana').className.includes('active')) {
          // 已投蕉
          return
        }
        bananaEat()
      }
    } else {
      // 文章页面
      if (document.querySelector('.up-operate .focus').textContent === '关注') {
        // 已关注
        if (document.querySelector('#article-operation .bananacount').className.includes('active')) {
          // 已投蕉
          return
        }
        bananaEat()
      }
    }
  })
})();