const { model } = require("../models/AdminUser");

module.exports = options=> async (req, res, next) => {
  // inflection用于处理转类名、下划线等处理
  const modelName = require('inflection').classify(req.params.resource)
  req.Model = require(`../models/${modelName}`)
  next()
}