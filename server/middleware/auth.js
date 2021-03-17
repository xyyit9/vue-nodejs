const assert = require('http-assert')
const jwt = require('jsonwebtoken')
const AdminUser = require('../models/AdminUser')

//登录校验中间件
module.exports= (options) => async (req, res, next) => {
  //获取用户是否登录
  const token = String(req.headers.authorization || '')
    .split(' ')
    .pop()
  assert(token, 401, '请提供jwt token') //请先登录
  // 通过token获取id
  const { id } = jwt.verify(token, req.app.get('secret'))
  assert(id, 401, '无效的jwt token') // 请先登录
  req.user = await AdminUser.findById(id)
  assert(req.user, 401, '请先登录')
  await next()
}
