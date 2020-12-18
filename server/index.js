const express = require('express')
const app=express();

//解决跨域问题
app.use(require('cors')())
// express.json()是一个express中间件,在post和put此类包含数据传输的请求配合使用
app.use(express.json())

require('./routes/admin')(app)
require('./plugins/db')(app)
app.listen(3000, ()=>{
    console.log('http://localhost:3000')
}) 