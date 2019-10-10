// pages/search/search.js

import artists from '../../artists.js'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    results: null
  },

  doSearch: function(event){
    const keyword = event.detail.value
    const results = []
    artists.forEach((artist,artistIndex) => {
      const songList = require(`../../data/${artist.uid}.js`)
      songList.forEach((song, index) => {
        if(song.songname.indexOf(keyword) !== -1){
          results.push({
            artist,
            song,
            artistIndex,
            index
          })
        }
      })
    })
    this.setData({
      results
    })
  },

  playItem: function(event){
    const item = event.currentTarget.dataset.item
    console.log(item)
    app.globalData.selectedSearchItem = item
    wx.navigateBack({delta: 1})
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})