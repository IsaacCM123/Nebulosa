/* Configuración base */
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require("path");
const app = express()
app.use(express.static(path.join(__dirname, 'public')))


app.use(cors())
app.use(express.json())
app.use(express.static('assets'))

/* Conectar MongoDB Atlas */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error(err))

/* Definir el esquema */
const commentSchema = new mongoose.Schema({
  email: { type: String, required: true },
  content: { type: String, required: true },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  replies: [
    {
      email: String,
      content: String,
      createdAt: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now }
})
const Comment = mongoose.model('Comment', commentSchema)

/* Crear comentario */
app.post('/api/comments', async (req, res) => {
  const { email, content } = req.body

  const comment = new Comment({ email, content })
  await comment.save()

  res.status(201).json(comment)
})

/* Obtener comentarios */
app.get('/api/comments', async (req, res) => {
  const comments = await Comment.find().sort({ createdAt: -1 })
  res.json(comments)
})

/* Me gusta, No me gusta*/
app.patch('/api/comments/:id/like', async (req, res) => {
  const comment = await Comment.findByIdAndUpdate(
    req.params.id,
    { $inc: { likes: 1 } },
    { new: true }
  )
  res.json(comment)
})

app.patch('/api/comments/:id/dislike', async (req, res) => {
  const comment = await Comment.findByIdAndUpdate(
    req.params.id,
    { $inc: { dislikes: 1 } },
    { new: true }
  )
  res.json(comment)
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

/* Responder comentario */
app.post('/api/comments/:id/reply', async (req, res) => {
  const { email, content } = req.body

  const comment = await Comment.findById(req.params.id)
  comment.replies.push({ email, content })
  await comment.save()

  res.json(comment)
})

/* Levantar servidor */
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`))

