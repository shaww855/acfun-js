/* 
 * 以下是需要在直播间获取的变量
 * 开F12，随便送个礼物抓个包即可获取
 */

// uid
const userId = ''
// 不知道
const did = 'web_XXXXXXXXXXXX'
// 好像是token
const acfunMidgroundApi_st = ''
// 直播ID
const liveId = ''
// 礼物ID (102是中秋限定的宝莲灯)
const giftId = 102
// 礼物个数
const batchSize = 1
// 变量名好像是触发连击的key
const comboKey = ''
/* 以上结束 */

// 构造请求地址
const url = `https://api.kuaishouzt.com/rest/zt/live/web/gift/send?subBiz=mainApp&kpn=ACFUN_APP&kpf=PC_WEB&userId=${userId}&did=did&acfun.midground.api_st=${acfunMidgroundApi_st}`

/*
 *  直接在直播间执行本脚本会跨域，需要打开 https://api.kuaishouzt.com/rest/zt/live/web/gift/send 执行
 */

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
)

/*
 * 执行后需要直接看弹幕池礼物是否送出
 */