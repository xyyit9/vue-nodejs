const mongoose = require('mongoose')
const schema = new mongoose.Schema({
  username: {type: String},
  // 表示查询的时候不被查出来，否则编辑密码的时候，会多次进行加密
  select: false,
  //密码加密传输, 使用bcrypt进行不可逆的散列化，比md5更安全
  password: {type: String, set(val){
    return require('bcrypt').hashSync(val, 10)
  }}
})
module.exports = mongoose.model('AdminUser', schema)
