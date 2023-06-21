/* 
 * 以下是需要在直播间获取的变量
 * 开F12，随便送个礼物抓个包即可获取
 * 直接在直播间执行本脚本会跨域，需要打开 https://api.kuaishouzt.com/rest/zt/live/web/gift/send 执行
 * 2022年4月9日晚测试发现没有跨域了
 */

// https://api.kuaishouzt.com/rest/zt/live/web/gift/list?subBiz=mainApp&kpn=ACFUN_APP&kpf=PC_WEB&userId=&did=&acfun.midground.api_st=

// uid
const userId = ''
// 不知道
const did = 'web_430635695C8D24CA'

// 好像是token
const acfunMidgroundApi_st = ''
// 直播ID
const liveId = ''

// 变量名好像是触发连击的key
const comboKey = ''
/* 以上结束 */

// 构造请求地址
const url = `https://api.kuaishouzt.com/rest/zt/live/web/gift/send?subBiz=mainApp&kpn=ACFUN_APP&kpf=PC_WEB&userId=${userId}&did=did&acfun.midground.api_st=${acfunMidgroundApi_st}`

/**
 * 送礼物
 * @param {*} giftId 礼物编号 查看 ./giftList.json
 * @param {*} batchSize 礼物个数
 */
function sendGift (giftId, batchSize = 1) {
  var formData = new FormData()
  formData.append('visitorId', userId)
  formData.append('liveId', liveId)
  formData.append('giftId', giftId)
  formData.append('batchSize', batchSize)
  formData.append('comboKey', comboKey)
  fetch(
    url,
    {
      method: 'post',
      body: formData
    }
  ).then(res =>
    res.json()
  ).then(res => {
    console.log(res);
    if (res.result === 380004) {
      // 礼物已下架，送礼失败
      alert(res.error_msg)
    } else {
      alert('礼物发送成功')
    }
  })
}
