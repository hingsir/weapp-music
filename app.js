//app.js

App({
  onLaunch: function () {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#ea5504', // 31c27c
    })
  },
  globalData: {
    selectedSearchItem: null
  },
  getUserInfo:function(cb){
    
  }
})
