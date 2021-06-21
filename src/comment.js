// 分组
const groupBy = (arr, fn) =>
  arr.map(typeof fn === 'function' ? fn : val => val[fn]).reduce((acc, val, i) => {
    acc[val] = (acc[val] || []).concat(arr[i]);
    return acc;
  }, {});

// 获取当前页面评论
function getCurPageComment() {
  let list = []
  const node_list = document.querySelectorAll('.fc-comment-item')
  Array.prototype.forEach.call(node_list, e => {
    const TARGET = e.querySelectorAll('.comment-name-bar li'),
      INFO = TARGET[1].querySelector('a')
    list.push({
      '昵称': TARGET[1].innerText,
      'UID': INFO.getAttribute('data-uid'),
      '楼层': TARGET[0].innerText.split('#')[1],
      '评论': e.querySelector('.comment-content').innerText
    })
  })
  let str = JSON.stringify(list.reverse())
  copy(str.slice(1, str.length - 1) + ',')
}

// 获取当前页弹幕
function getCurDanmaku() {
  let list = []
  Array.prototype.forEach.call(document.querySelectorAll('.danmaku-items li.danmaku-item'), e => {
    list.push({
      user: e.getAttribute('data-user'),
      time: e.getAttribute('data-time'),
      message: e.getAttribute('data-message')
    })
  })
  return list
}

groupBy(getCurDanmaku(), 'user')