var URL = 'http://decision-admin.tianqi.cn/Home/Count/getAppCountInfo'
var data 
$.ajax({
  url:URL,
  type:'GET',
  // async:false,
  success:function (result) {
    render(result)
    console.log(JSON.parse(result))
  }
})
function render(result) {
  var myBigData = JSON.parse(result)
  console.log(myBigData)
  // 1.0 头部渲染
  TOOLS.renderTopChart(myBigData.dayCount.data)
  // 2.0 渲染地域分布
  TOOLS.geoDist(myBigData.loginCount.data)
  // // 3.0 访问页面
  TOOLS.visitPage(myBigData.clickCount.data)
  // // 4.0 用户时长
  TOOLS.useTime(myBigData.hourCount.data)
  // // 5.0 系统统计
  TOOLS.systemHour(myBigData.loginTypeCount.data)
  // 6.0 访问统计
  TOOLS.visitStatics(myBigData.clickCount.data)
}

