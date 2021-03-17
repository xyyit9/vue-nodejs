const assert = require('http-assert')

module.exports = (app) => {
  const express = require('express')
  const assert = require('http-assert')
  const authMiddleware = require('../../middleware/auth')
  const resourceMiddleware = require('../../middleware/resource')
  // mergeParams表示合并url参数，父级路由参数在子级中也可以拿到
  const router = express.Router({ mergeParams: true })
  const jwt = require('jsonwebtoken')
  const AdminUser = require('../../models/AdminUser')

  // 创建资源
  router.post('/', async (req, res) => {
    const model = await req.Model.create(req.body)
    res.send(model)
  })
  //更新
  router.put('/:id', async (req, res) => {
    const model = await req.Model.findByIdAndUpdate(req.params.id, req.body)
    res.send(model)
  })
  //删除
  router.delete('/:id', async (req, res) => {
    const model = await req.Model.findByIdAndDelete(req.params.id, req.body)
    res.send({ success: true })
  })
  //列表
  router.get('/', async (req, res) => {
    const queryOptions = {}
    // 接口是通用接口，但可扩展，如果模型是个Category，还需要关联查找parent
    if (req.Model.modelName === 'Category') {
      queryOptions.populate = 'parent'
    }
    const items = await req.Model.find().setOptions(queryOptions).limit(10)
    res.send(items)
  })
  //详情
  router.get('/:id', async (req, res) => {
    const model = await req.Model.findById(req.params.id)
    res.send(model)
  })

  // resource是动态model
  app.use(
    '/admin/api/rest/:resource',
    authMiddleware(),
    resourceMiddleware(),
    // 添加中间键
    router
  )
  //Multer 是一个 node.js 中间件，用于处理 multipart/form-data 类型的表单数据，它主要用于上传文件。
  const multer = require('multer')
  const upload = multer({ dest: __dirname + '/../../uploads' })
  // upload.single('file')中间件，让req上存在file属性，做到可以上传图片
  app.post('/admin/api/upload',authMiddleware(), upload.single('file'), async (req, res) => {
    const file = req.file
    file.url = `http://localhost:3000/uploads/${file.filename}`
    res.send(file)
  })

  app.post('/admin/api/login', async (req, res) => {
    const { username, password } = req.body
    // 1.根据用户名找用户
    // .select('+password')表示把密码也取出来，默认不取
    const user = await AdminUser.findOne({ username }).select('+password')
    assert(user, 422, '用户不存在')
    console.log('222222')
    /* 与上面的写法一致  
     if (!user) {
      return res.status(422).send({ message: '用户不存在' })
    } */
    // 2.校验密码
    const isValid = require('bcrypt').compareSync(password, user.password)
    assert(isValid, 422, '密码错误')
    /*     if (!isValid) {
      return res.status(422).send({ message: '密码错误' })
    } */
    // 3.返回token
    const token = jwt.sign({ id: user._id }, app.get('secret'))
    res.send({ token })
  })

  //错误处理函数
  app.use(async (err, req, res, next) => {
    console.log(err)
    res.status(err.statusCode || 500).send({ message: err.message })
  })
}
