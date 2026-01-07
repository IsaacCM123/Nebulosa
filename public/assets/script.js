/* Enviar comentario */
const form = document.getElementById('commentForm')
const emailInput = document.getElementById('email')
const contentInput = document.getElementById('content')

let userEmail = localStorage.getItem('email') || ''

form.addEventListener('submit', async e => {
  e.preventDefault()

  userEmail = emailInput.value

  const email = emailInput.value.trim()
  const content = contentInput.value.trim()

  if (!email || !content) return
    userEmail = email
  // 👇 ACÁ VA localStorage
  localStorage.setItem('email', userEmail)

  await fetch('/api/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body:JSON.stringify({email:userEmail,content})
  })

  form.reset()
  loadComments()
})

/* Cargar comentarios */
function loadComments() {
  fetch('/api/comments')
    .then(res => res.json())
    .then(comments => {
      const container = document.getElementById('comments')
      container.innerHTML = ''

      comments.forEach(c => {
        const div = document.createElement('div')
        div.innerHTML = `
          <p><strong>${c.email}</strong>: ${c.content}</p>
          <button class="like-btn">👍 ${c.likes.length}</button>
          <button class="dislike-btn">👎 ${c.dislikes.length}</button>
        `

        div.querySelector('.like-btn')
          .addEventListener('click', () => handleLike(c._id))

        div.querySelector('.dislike-btn')
          .addEventListener('click', () => handleDislike(c._id))

        container.appendChild(div)
      })
    })
}

async function handleLike(id) {
  if (!userEmail) {
    alert('Ingresá tu email para votar')
    return
  }
  await fetch(`/api/comments/${id}/like`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: userEmail })
  })
  loadComments()
}

async function handleDislike(id) {
  if (!userEmail) {
    alert('Ingresá tu email para votar')
    return
  }
  await fetch(`/api/comments/${id}/dislike`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: userEmail })
  })
  loadComments()
}

document.addEventListener('DOMContentLoaded', () => {
  loadComments()
})
