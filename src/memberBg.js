
const send = new FormData()
send.append('spaceImage', 'https://imgs.aixifan.com/newUpload/620132_58bcce11b4de4c47a841cfd6d32289bd.gif?imageMogr2/thumbnail/1920x/crop/1920x1080')
fetch('https://www.acfun.cn/rest/pc-direct/user/updateSpaceImage', {
  method: 'post',
  body: send
})