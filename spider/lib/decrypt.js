
var CryptoJS = require('crypto-js')

module.exports = function (url) {
  var _0x5d37f9 = {
    sigBytes: 16,
    words: [862217011, 842229300, 1647601203, 1630626150]
  }

  var _0xa51628 = {
    sigBytes: 16,
    words: [1630615398, 1698116709, 875704675, 845374054]
  }
  return CryptoJS.AES.decrypt(url, _0x5d37f9, {
    iv: _0xa51628,
    padding: CryptoJS.pad.Pkcs7
  })['toString'](CryptoJS['enc']['Utf8'])
}
