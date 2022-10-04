// ==UserScript==
// @name         将acfun直播颜文字替换成匿名版颜表情
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  虽然不再上岛了，但还是习惯用匿名版颜表情
// @author       泥壕
// @match        https://live.acfun.cn/live/*
// @icon         //cdn.aixifan.com/ico/favicon.ico
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

  const list = ["|∀ﾟ", "(´ﾟДﾟ`)", "(;´Д`)", "(｀･ω･)", "(=ﾟωﾟ)=", "| ω・´)", "|-` )", "|д` )", "|ー` )", "|∀` )", "(つд⊂)", "(ﾟДﾟ≡ﾟДﾟ)", "(＾o＾)ﾉ", "(|||ﾟДﾟ)", "( ﾟ∀ﾟ)", "( ´∀`)", "(*´∀`)", "(*ﾟ∇ﾟ)", "( ´_ゝ`)", "(*ﾟーﾟ)", "(　ﾟ 3ﾟ)", "( ´ー`)", "( ・_ゝ・)", "(*´д`)", "(・ー・)", "(・∀・)", "(ゝ∀･)", "(`ε´ )", "(〃∀〃)", "(ﾟ∀ﾟ)", "( ﾟ∀。)", "( `д´)", "(`ヮ´ )", "σ`∀´)", "ﾟ∀ﾟ)σ", "ﾟ ∀ﾟ)ノ", "(╬ﾟдﾟ)", "(|||ﾟдﾟ)", "( ﾟдﾟ)", "Σ( ﾟдﾟ)", "( ;ﾟдﾟ)", "( ;´д`)", "(　д ) ﾟ ﾟ", "( ☉д⊙)", "(((　ﾟдﾟ)))", "( ` ・´)", "( ´д`)", "( -д-)", "(>д<)", "･ﾟ( ﾉд`ﾟ)", "( TдT)", "(￣∇￣)", "(￣3￣)", "(￣ｰ￣)", "(￣ . ￣)", "(￣皿￣)", "(￣艸￣)", "(￣︿￣)", "(￣︶￣)", "ヾ(´ωﾟ｀)", "(´ω`)", "(・ω・)", "( ´・ω)", "(｀・ω)", "(´・ω・`)", "(`・ω・´)", "( `_っ´)", "( `ー´)", "( ´_っ`)", "( ´ρ`)", "( ﾟωﾟ)", "(oﾟωﾟo)", "(　^ω^)", "(｡◕∀◕｡)", "/( ◕‿‿◕ )\\", "ヾ(´ε`ヾ)", "(ノﾟ∀ﾟ)ノ", "(σﾟдﾟ)σ", "(σﾟ∀ﾟ)σ", "|дﾟ )", "┃電柱┃", "ﾟ(つд\`ﾟ)", "ﾟÅﾟ )　", "⊂彡☆))д\`)", "⊂彡☆))д´)", "⊂彡☆))∀\`)", "(´∀((☆ミつ", "( ´_ゝ\`)旦", "･ﾟ( ﾉヮ´ )", "(ﾉ)\`ω´(ヾ)", "ᕕ( ᐛ )ᕗ", "(　ˇωˇ)", "( ｣ﾟДﾟ)｣＜", "( ›´ω\`‹ )", "(ヮ´ )σ∀´) ﾟ∀ﾟ)σ"]

  ready(() => {
    let times = 0
    const timeId = setInterval(() => {
      if (times > 50) {
        console.log('=颜表情替换超时=');
        clearInterval(timeId)
      }
      const target = document.querySelector('.container-live-feed.right .faces-container')
      if (target !== null) {
        clearInterval(timeId)

        let html = ''
        list.forEach(e => {
          const className = e.length > 9 ? 'face face2' : 'face'
          html += `<div title="${e}" class="${className}">${e}</div>`
        })
        target.innerHTML = html

        const inject = document.createElement('style')
        inject.innerHTML = `.live-feed .face-text .face-text-panel .face-text-panel-content {overflow:auto;}`
        document.querySelector('head').appendChild(inject)
        console.log('=替换完毕=');
      } else {
        console.log('=未找到DOM，继续等待=');
      }
      times++
    }, 1000)
  })

})();
