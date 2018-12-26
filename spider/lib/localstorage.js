var fs = require('fs')

module.exports = {
    loadStorage: function(file) {
        var localStorage = []
        try {
            localStorage = JSON.parse(fs.readFileSync(file))
        } catch (e) {
            localStorage = []
        }
        return localStorage
    },
    saveStorage: function(file, data) {
        fs.writeFileSync(file, JSON.stringify(data), 'utf-8')
    },
    get: function(localStorage, key, value) {
        var obj
        localStorage.forEach((item) => {
            if (item[key] == value) {
                obj = item
            }
        })
        return obj
    }
}
