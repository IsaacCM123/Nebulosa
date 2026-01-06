/* Enviar comentario */
const form = document.getElementById('commentForm')

form.addEventListener('submit', async e => {
  e.preventDefault()

  const email = email.value
  const content = content.value

  await fetch('/api/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, content })
  })

  form.reset()
  loadComments()
})

/* Cargar comentarios */
async function loadComments() {
  const res = await fetch('/api/comments')
  const comments = await res.json()

  const container = document.getElementById('comments')
  container.innerHTML = ''

  comments.forEach(c => {
    container.innerHTML += `
      <div>
        <p><strong>${c.email}</strong>: ${c.content}</p>
        <button onclick="like('${c._id}')">👍 ${c.likes}</button>
        <button onclick="dislike('${c._id}')">👎 ${c.dislikes}</button>
      </div>
    `
  })
}

loadComments()
