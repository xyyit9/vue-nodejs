const mongoose = require('mongoose')
const schema = new mongoose.Schema({
  name: { type: String },
  avatar: { type: String },
  title: { type: String },
  //复数和数组可以让一个英雄属于多个分类，比如司马懿属于刺客和法师
  categories: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Category' }],
  // 分数
  scores: {
      difficult: {type: Number},
      skills: {type: Number},
      attack: {type: Number},
      survive: {type: Number},
  },
  // 技能
  skills:[{
      icon: {type: String},
      name: {type: String},
      description: {type: String},
      tips: {type: String},
  }],
  //顺风出装
  items1:[{ type: mongoose.SchemaTypes.ObjectId, ref: 'Item' }],
  //逆风出装
  items2:[{ type: mongoose.SchemaTypes.ObjectId, ref: 'Item' }],
  // 使用技巧
  usageTips: { type: String },
  // 对抗技巧
  battleTips: { type: String },
  // 团队思路
  teamTips: { type: String },
  // 搭档
  partners: [{
      hero: { type: mongoose.SchemaTypes.ObjectId, ref: 'Hero' },
      description: {type: String}
  }]
})
module.exports = mongoose.model('Hero', schema)
