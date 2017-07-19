window.TOOLS = {}

// 1.0 用户登录次数统计图表
TOOLS.renderTopChart =function (data) {
  var obj = TOOLS.parseData(data) 
  var dataObj = TOOLS.parseData(data)
  var option = {
    grid: {
        left: '50',
        top: '50',
        right: '40',
        bottom: '50'
    },
    tooltip : {
        trigger: 'axis',
        position: "top",
        confine: 'true',
        formatter: function formatter(data) {
            return formatNum(data[0]['data']);
        },
        backgroundColor:'#0059aa',
        position: function position(p) {
            //其中p为当前鼠标的位置
            return [p[0] -25, p[1] - 40];
        },
        axisPointer: {
            type: 'none'
        }
    },
    xAxis : [
        {
            type : 'category',
            boundaryGap : false,
            axisTick: {
                show: false
            },
            axisLine:{
              onZero: false,
              lineStyle:{
                  color: '#939ea5',
                  width: 3,
                  type: 'solid'
              }     
            },
            axisLabel: {
                show: true,
                textStyle: {
                    color: '#bdc9d0'
                },
                formatter:function(params){
                  return  params.split(',')[0] +"\n" + params.split(',')[1] 
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    // 使用深浅的间隔色
                    color: '#f3f3f3'
                }
            },
            data : dataObj.x
        }
    ],
    yAxis : [
        {
            type : 'value',
            axisTick: {
                show: false
            },
            axisLine:{
                show: false
            },
            axisLabel: {
                formatter: '{value}',
                show: true,
                textStyle: {
                    color: '#bdc9d0'
                }
            },
            splitLine: {
              lineStyle:{
                color: '#f3f3f3'
              }  
            },
        }
    ],
    series : [
        {
            name:'次数',
            type:'line',
            data:dataObj.y,
            itemStyle: {
                normal: {
                    color: '#0059aa',
                    lineStyle: {
                        color: '#0059aa',
                        width: 1.5
                    },
                    label: {
                        // show: true,
                        textStyle: {
                            color: '#fff',
                        }
                    },
                    areaStyle: {
                      type: 'default',
                      color: '#f2f8ff'
                    }
                }
            },
            // markPoint : {
            //     data : [
            //         {
            //           type : 'max',
            //           name: '最大值',
            //           symbol:'roundRect',
            //           value:'23',
            //           symbolSize: [50,30],
            //           symbolOffset:[0,-20]
            //        }
            //     ]
            // },
        }
    ]
  };
  console.log(dataObj)
  // 基于准备好的dom，初始化echarts实例
  var myChart = echarts.init(document.getElementById('chartShow'));

  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option);   
  var app= {}  
  app.currentIndex = getMaxIndex(dataObj.y) - 1;

setTimeout(function () {
  console.log(app.currentIndex)
    var dataLen = option.series[0].data.length;
    // 取消之前高亮的图形
    myChart.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: app.currentIndex
    });
    app.currentIndex = (app.currentIndex + 1) % dataLen;
    // 高亮当前图形
    myChart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: app.currentIndex
    });
    // 显示 tooltip
    myChart.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: app.currentIndex
    });
}, 1000);
             
}

// 将原始数据解析成图表数据
TOOLS.parseData = function (data) {
  var obj = {}
  var valueArr = []
  var dateArr = []
  var newDate = []
  $.each(data,function (index,value) {
    valueArr.push(parseInt(value.count))
    dateArr.push(value.time)
    newDate.push(TOOLS.formatDay(value.time))
  })
  obj.y = valueArr
  obj.x = []
  for (var i = 0; i < 7; i++) {
    obj.x[i] = newDate[i]+','+TOOLS.getWeek(dateArr[0])[i]
  }
  var num = 0;
  $.each(valueArr,function (index,value) {
    num += value
  })
  var options = {
    useEasing : true, 
    useGrouping : true, 
    separator : ',', 
    decimal : '.', 
  };
  // 数字增加动画
  var demo = new CountUp($('.thisWeek h2').get(0), 0, num, 0, 3, options);
  demo.start();
  // $('.thisWeek h2').html(num)
  $('.one .right').html('时段:'+newDate[0]+' — '+newDate[6]+'')
  return obj
}

// 获取星期数组
TOOLS.getWeek = function (lastDay) {
  var year = lastDay.slice(0,4)
  var month = lastDay.slice(4,6)
  var day = lastDay.slice(6,8)
  var newData = year + '-' + month + '-' + day
  var weekArr = '周日,周一,周二,周三,周四,周五,周六'.split(",");
  var curDate = new Date(newData);
  var curWeekDay = curDate.getDay();
  var timeStr = "";
  switch (curWeekDay) {
    case 0:
      timeStr += '周日';break;
    case 1:
      timeStr += '周一';break;
    case 2:
      timeStr += '周二';break;
    case 3:
      timeStr += '周三';break;
    case 4:
      timeStr += '周四';break;
    case 5:
      timeStr += '周五';break;
    case 6:
      timeStr += '周六';break;
  }
  var index = weekArr.indexOf(timeStr);
  var arr1 = weekArr.splice(index);
  weekArr = arr1.concat(weekArr);
  return weekArr;
}

// 格式化日期
TOOLS.formatDay =function (lastDay) {
  var month = parseInt(lastDay.slice(4,6))
  var day = parseInt(lastDay.slice(6,8))
  return month + "/" + day
}
// 2.0 地域分布
TOOLS.geoDist = function(data){
  var finalData = TOOLS.formatMapData(data)
  function randomData() {
    return Math.round(Math.random()*1000);
  }

  var option = {
      title: {
          text: '',
          subtext: '',
          left: 'center'
      },
      tooltip: {
          trigger: 'item',
          backgroundColor:'#0059aa',

      },
      series: [
          {
              name: '启动次数',
              type: 'map',
              mapType: 'china',
              roam: false,
              itemStyle:{
                normal:{
                  label:{show:false},
                  borderWidth:2,//省份的边框宽度
                  borderColor:'#fff',//省份的边框颜色
                  color:'#000',//地图背景颜色
                  areaColor:'#959fa5'//设置地图颜色
                },
                emphasis: {
                  label:{show:false},
                  areaColor: '#ff7e00'
                }
              },  
              data: finalData
          }
      ]
  };
    // 基于准备好的dom，初始化echarts实例
  var Chart = echarts.init(document.getElementById('geoDist'));

  // 使用刚指定的配置项和数据显示图表。
  Chart.setOption(option);     
var currentIndex = -1;

setTimeout(function () {
    var dataLen = option.series[0].data.length;
    // 取消之前高亮的图形
    Chart.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: currentIndex
    });
    currentIndex = (currentIndex + 1) % dataLen;
    // 高亮当前图形
    Chart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: currentIndex
    });
    // 显示 tooltip
    Chart.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: currentIndex
    });
}, 10);

  
  // Chart.component.tooltip.showTip({ seriesIndex: 0, name:'北京' })
}

// 格式化地图数据
TOOLS.formatMapData = function (data) {
  
  data = TOOLS.sortData(data,'count')
  var dataArr = []
  //{name: '北京', selected:true,value: randomData() },
  $.each(data,function (index,value) {
    var address = value.address.replace('省','').replace('市','').replace("内蒙古自治区",'内蒙古').replace('广西壮族自治区','广西').replace('宁夏回族自治区','宁夏').replace('新疆维吾尔自治区','新疆').replace('澳門特別行政區','澳门').replace('香港特別行政區','香港').replace('西藏自治区','西藏')
    if (index<3) {
      dataArr.push({"name":address,"value":parseInt(value.count),"selected":true})
    }else{
      dataArr.push({"name":address,"value":parseInt(value.count)})
    }
  })
  dataArr.push( {"name": '南海诸岛',"value": 0, "itemStyle":{ "normal":{"opacity":0,"label":{show:false}}}})
  $('#place_most').html(dataArr[0]['name'])
var liStr = '<li>' + dataArr[0].name + ' ' + formatNum(dataArr[0].value) + '  <span style=\'background-image:url(img/' + dataArr[0].name + '.png)\'></span></li>\n               <li>' + dataArr[1]['name'] + ' ' + formatNum(dataArr[1].value) + '  <span  style=\'background-image:url(img/' + dataArr[1].name + '.png)\'></span></li>\n               <li>' + dataArr[2]['name'] + ' ' + formatNum(dataArr[2].value) + '  <span  style=\'background-image:url(img/' + dataArr[2].name + '.png)\'></span></li>';
  $('#cityMost').html(liStr)
  return dataArr
}
// 数组排序
TOOLS.sortData = function (newData,name) {
  var data = TOOLS.deepCopy(newData)
  // var data = newData
  for (var i = 0; i < data.length; i++) {
    for (var j = 0; j < data.length; j++) {
      if (parseInt(data[i][name]) > parseInt(data[j][name])) {
        var temp = data[i]
        data[i] = data[j]
        data[j] = temp
      }
    }
  }
  return data
}
TOOLS.deepCopy = function (p, c) {
　　　　var c = c || [];
　　　　for (var i in p) {
　　　　　　if (typeof p[i] === 'object') {
　　　　　　　　c[i] = {};
　　　　　　　　this.deepCopy(p[i], c[i]);
　　　　　　} else {
　　　　　　　　　c[i] = p[i];
　　　　　　}
　　　　}
　　　　return c;
}

// 3.0 访问页面
TOOLS.visitPage = function (data) {
  var newData = this.sortData(data,'count')
  var useData =newData.slice(0,3)
  $('#pageMost').html(useData[0]['eventname']) 
  $.each(useData,function (index,value) {
    $('#podium li:eq('+index+') .title').css({
      width: '60%',
      height: '60px',
      margin: '0 20%',
    })
    $('.bottom_tip li:eq('+index+') img').attr('src',value.icon)
    $('.bottom_tip li:eq('+index+') .tip').html(value.eventname).css({
      'fontSize': '0.8rem'
    })
    $('.bottom_tip li:eq('+index+') span').html(formatNum(value.count)).css({
      'fontSize': '1rem'
    })
  })
  $('#podium li:eq(1) .title').css( 'background', 'url('+useData[0].icon+') no-repeat center/contain')
  $('#podium li:eq(0) .title').css( 'background', 'url('+useData[1].icon+') no-repeat center/contain')
  $('#podium li:eq(2) .title').css( 'background', 'url('+useData[2].icon+') no-repeat center/contain')
     
}
// 4.0 使用时段统计
TOOLS.useTime = function (data) {
  var dataObj = data
  var params1 = dataObj
  this.renderTimeDataTitle(data)
  dataObj = this.parseTimeData(dataObj)
  var sortData = TOOLS.sortData(params1,'count')
  var indexAndValue = TOOLS.getIndexAndValue(params1,sortData)
  var option = {
      color: ['#3398DB'],
      tooltip: {
        trigger: 'item',
        triggerOn:"click",
        formatter: function (data) {
          return data.name + '时: ' + data.value + '次'
        }
      },
      grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '28%',
          containLabel: true
      },
      xAxis : [
        {
            type : 'category',
            boundaryGap : false,
            axisTick: {
                show: false
            },
            axisLine:{
              onZero: false,
              lineStyle:{
                  color: '#939ea5',
                  width: 3,
                  type: 'solid'
              }     
            },
            axisLabel: {
                show: true,
                textStyle: {
                    color: '#bdc9d0'
                },
                formatter:function(params){
                  return  params
                }
            },
            data : dataObj.x
        }
      ],
      yAxis : [
          {
              type : 'value',
              axisTick: {
                  show: false
              },
              axisLine:{
                  show: false
              },
              axisLabel: {
                  formatter: '{value}',
                  show: true,
                  textStyle: {
                      color: '#bdc9d0'
                  }
              },
              splitLine: {
                lineStyle:{
                  show: false,
                  color: 'rgba(0,0,0,0)'
                }  
              },
          }
      ],
      series : [
          {
              name:'直接访问',
              type:'bar',
              barWidth: '90%',
              itemStyle: {
                normal:{
                  color: function (param) {
                    if(parseInt(param.value) === parseInt(indexAndValue.value[0])){
                      return '#ff7e00'
                    }
                    return '#0059aa'
                  },
                }
              },
              markPoint : {
                  data : [
                      {
                      type : 'max',
                      name: '最大值',
                      symbolOffset:[0,0]
                   }
                    // {
                    //   coord: [indexAndValue.index[0], indexAndValue.value[0]],
                    //   name: '最大值',
                    //   value: 33
                    // },
                    //  {
                    //   coord: [indexAndValue.index[1], indexAndValue.value[1]],
                    //   name: '第二大值',
                    //   value: 32
                    // }, {
                    //   coord: [indexAndValue.index[2], indexAndValue.value[2]],
                    //   name: '第三大值',
                    //   value: 26
                    // }
                  ],
                  itemStyle:{
                    normal:{

                    }
                  }
              },
              data: dataObj.y
          }
      ]
  };
  // // 基于准备好的dom，初始化echarts实例
  var Chart = echarts.init(document.getElementById('useTime'));
  // // 使用刚指定的配置项和数据显示图表。
  Chart.setOption(option); 

  var IndexArr = []
  var IndexValueArr = []
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < params1.length; j++) {
      if (params1[j]['time'] == sortData[i]['time']) {
        IndexArr.push(j)
        IndexValueArr.push(params1[j]['count'])
      }
    }
  }
  var mostHour = sortData[0]['time'].slice(8,10)
  var mostHourNext = +mostHour+1
  mostHourNext = mostHourNext<10?('0'+mostHourNext):mostHourNext
  $('#hourMost').html(mostHour + '-' + mostHourNext)
}
TOOLS.parseTimeData = function (data) {
  var hourArr = []
  var valueArr = []
  $.each(data,function (index,value) {
    hourArr.push(value.time.slice(8,10))
    valueArr.push(value.count)
  })
  return {x:TOOLS.reverseArr(hourArr),y:TOOLS.reverseArr(valueArr)}
}
// 渲染头部
TOOLS.renderTimeDataTitle = function (data) {
  var start = data[data.length - 1]['time']
  start = start.slice(4,6) + '/' +start.slice(6,8) + ' ' +start.slice(8,10) + ':' + '00'
  var end = data[0]['time']
  end = end.slice(4,6) + '/' +end.slice(6,8) + ' ' +end.slice(8,10) + ':' + '00'
  $('#timeRange').html('时段:' + start + ' — ' + end )

}
// 翻转数组
TOOLS.reverseArr = function (arr) {
  var newArr = [];
  for (var i = 0; i < arr.length; i++) {
    var key = arr[arr.length - i - 1]
    newArr.push(key)
  }
  return newArr
}
// 获取最大三项索引和值
TOOLS.getIndexAndValue = function (originData,sortData) {
  var arrIndex = ['','','']
  var arrValue = ['','','']
  for (var i = 0; i < originData.length; i++) {
    for (var j = 0; j < 3; j++) {
      if (originData[i]['time'] === sortData[j]['time']) {
        arrIndex[j] = 23 - i
        arrValue[j] = originData[i]['count']
      }
    }
  }
  return {index : arrIndex, value:  arrValue}
  
}
// 5.0 使用设备
TOOLS.systemHour = function (data) {
  TOOLS.renderOthers(data)
  
  var option = {
      tooltip: {
        trigger: 'item',
        triggerOn:"click",
        formatter: "{a} <br/>{b} : {c}次 ({d}%)"
      },
      grid: {
        top: '200',
        bottom: '30%'
      },
      series: [{
        name: '操作系统',
        type: 'pie',
        radius: ['40%', '80%'],
        startAngle: 180,
        label: {
          normal: {
            textStyle:{
              color: '#222'
            },
            show: true,
            formatter: function (data) {
              return data['name'] + '\n' + data['percent'] + '%'
            }
          }
        },
        data: [
                {
                  value:data[0]['count'], 
                  name:'Android',
                  itemStyle:{
                    normal:{
                      color: '#0059aa'
                    }
                  },
                  labelLine:{
                    normal:{
                      lineStyle: {
                        color: '#222'
                      }
                    }
                  },
                },
                {
                  value:data[1]['count'],
                  name:'iOS',
                  itemStyle:{
                    normal: {
                      color: '#ff7e00'
                    },
                    labelLine:{
                      normal:{
                        lineStyle: {
                          color: '#222'
                        }
                      }
                    },
                  },
                  labelLine:{
                    normal:{
                      lineStyle: {
                        color: '#222'
                      }
                    }
                  },
                },
            ],
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    };
  // 基于准备好的dom，初始化echarts实例
  var Chart = echarts.init(document.getElementById('system'));
  // 使用刚指定的配置项和数据显示图表。
  Chart.setOption(option);                   
}
TOOLS.renderOthers = function (data) {
  $('#hourIOS').html(formatNum(data[1]['count']))
  $('#hourOthers').html(formatNum(data[0]['count']))
}
// 6.0 访问统计
// TOOLS.visitStatics = function (data) {
//   var newData = TOOLS.formatVisitData(data)

//   var max = TOOLS.sortData(data,'count')[0]['count']
//   var builderJson = {
//     "all": Math.ceil(max/10000)*10000,
//     "charts": newData
//   };
//   console.log(max)
//   var waterMarkText = 'ECHARTS';

//   option = {
//       tooltip: {
//         trigger:'axis',
//         axisPointer: {
//             type: 'shadow'
//         },
//       },
//       grid: [{
//           top: 20,
//           width: '110%',
//           bottom: 50,
//           left: '-24%',
//           containLabel: true
//       }],
//       xAxis: [{
//           type: 'value',
//           max: builderJson.all,
//           splitLine: {
//               show: false
//           }
//       }],
//       yAxis: [{
//           type: 'category',
//           data: Object.keys(builderJson.charts),
//           nameLocation:'start',
//           inverse:true,
//           axisLabel: {
//             show: false,
//             interval: 0,
//             rotate: 0
//           },
//           splitLine: {
//               show: false
//           },
//           axisTick:{
//             show:false
//           }
//       }],
//       series: [{
//           type: 'bar',
//           stack: 'chart',
//           z: 3,
//           label: {
//               normal: {
//                   textStyle:{
//                     color: '#222',
//                   },
//                   position: 'right',
//                   show: true
//               }
//           },
//          itemStyle: {
//                 normal:{
//                   color: function (param) {
//                     if(parseInt(param.value) === parseInt(max)){
//                       return '#ff7e00'
//                     }
//                     return '#0059aa'
//                   },
//                 }
//           },
//           data: Object.keys(builderJson.charts).map(function (key) {
//               return builderJson.charts[key];
//           })
//       }]
//   }
//     // 基于准备好的dom，初始化echarts实例
//   var Chart = echarts.init(document.getElementById('visitChart'));
//   // 使用刚指定的配置项和数据显示图表。
//   Chart.setOption(option);   
// }
// TOOLS.formatVisitData = function (data) {
//   console.log(data)
//   var obj ={}
//   for (var i = 0; i < data.length; i++) {
//     var key = data[i]['eventname']
//     var value = data[i]['count']
//     if(key){
//       obj[key] = value
//     }
//   }
//   console.log(obj)
//   return obj
// }

// function   formatNum(num)
// {   
//     if(!/^(\+|-)?(\d+)(\.\d+)?$/.test(num)){alert("wrong!");   return   num;}   
//     var   a   =   RegExp.$1,   b   =   RegExp.$2,   c   =   RegExp.$3;   
//     var   re   =   new   RegExp().compile("(\\d)(\\d{3})(,|$)");   
//     while(re.test(b))   b   =   b.replace(re,   "$1,$2$3");   
//     return   a   +""+   b   +""+   c;  
// }
// function formatNum(val) { 
//   var aIntNum = val.toString().split('.'); 
//   var iIntPart = aIntNum[0]; 
//   var iFlootPart = aIntNum.length > 1 ? '.' + aIntNum[1] : ''; 
//   var rgx = /(\d+)(\d{3})/; 
//   if (iIntPart.length >= 5) { 
//     while (rgx.test(iIntPart)) { 
//       iIntPart = iIntPart.replace(rgx, '$1' + ',' + '$2'); 
//     } 
//   } 
//    return iIntPart + iFlootPart; 
// }

function formatNum(num) {
  num = parseInt(num) + ''
  num = num.split('')
  num = TOOLS.reverseArr(num)
  var newNum = []
  for (var i = 0; i < num.length; i++) {
    newNum.push(num[i])
    if((i+1)%3 === 0 ){
      newNum.push(',')
    }
  }
  newNum = TOOLS.reverseArr(newNum).join('')
  return newNum
}
function getMaxIndex(arr) {
  console.log(arr)
  var newArr = TOOLS.deepCopy(arr)
  for (var i = 0; i < newArr.length; i++) {
    for (var j = 0; j < newArr.length; j++) {
      if(newArr[i]>newArr[j]){
        var temp = newArr[i]
        newArr[i] = newArr[j]
        newArr[j] = temp
      }
    }
  }
  console.log(arr)
  console.log(newArr)
  for (var k = 0; k < arr.length; k++) {
    if(arr[k] === newArr[0]){
      return k
    }
  }
}

