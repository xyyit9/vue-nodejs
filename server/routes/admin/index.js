module.exports = (app) => {
  const express = require('express')
  // mergeParams表示合并url参数，父级路由参数在子级中也可以拿到
  const router = express.Router({ mergeParams: true })
  router.post('/', async (req, res) => {
    const model = await req.Model.create(req.body)
    res.send(model)
  })
  router.put('/:id', async (req, res) => {
    const model = await req.Model.findByIdAndUpdate(req.params.id, req.body)
    res.send(model)
  })
  router.delete('/:id', async (req, res) => {
    const model = await req.Model.findByIdAndDelete(req.params.id, req.body)
    res.send({ success: true })
  })
  router.get('/', async (req, res) => {
    const queryOptions = {}
    // 接口是通用接口，但可扩展，如果模型是个Category，还需要关联查找parent
    if(req.Model.modelName === 'Category'){
      queryOptions.populate = 'parent'

    }
    const items = await req.Model.find().setOptions(queryOptions).limit(10)
    res.send(items)
  })
  router.get('/:id', async (req, res) => {
    const model = await req.Model.findById(req.params.id)
    res.send(model)
  })
  // resource是动态model
  app.use(
    '/admin/api/rest/:resource',
    // 添加中间键
    async (req, res, next) => {
      // inflection用于处理转类名、下划线等处理
      const modelName = require('inflection').classify(req.params.resource)
      req.Model = require(`../../models/${modelName}`)
      next()
    },
    router
  )
}
