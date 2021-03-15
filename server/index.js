const express = require('express')
const app = express()

//再express的实例上设置一个变量
app.set('secret', '2kr78j2y4fh')

//解决跨域问题
app.use(require('cors')())
// express.json()是一个express中间件,在post和put此类包含数据传输的请求配合使用
app.use(express.json())
// uploads路径下的东西都是静态的，托管静态文件
app.use('/uploads', express.static(__dirname + '/uploads'))


require('./routes/admin')(app)
require('./plugins/db')(app)
app.listen(3000, () => {
  console.log('http://localhost:3000')
})
