import axios from 'axios'
const objectToFormData = (post) => {
  console.log(post)
  const fd = new FormData()
  fd.append('title', post.title)
  fd.append('shortcat', post.shortcat)
  fd.append('picture', post.picture)
  fd.append('views', post.views)
  fd.append('content', post.content)
  fd.append('categories', JSON.stringify(post.categories))
  return fd
}
const postsApi = {
  getPostById (id) {
    return axios.get(`http://localhost:3000/api/post/${id}`)
      .then(response => response.data)
      .catch(e => { console.error(e); return [] })
  },
  getAllPostsPreview (token) {
    return axios.get('http://localhost:3000/api/postsAll', { headers: { token } })
      .then(response => { console.log(response.data); return response.data })
      .catch(e => { console.error(e); return [] })
  },
  addNewPost (post, token) {
    return axios.post('http://localhost:3000/api/addNewPost', objectToFormData(post), { headers: { token } })
      .then(res => res.data)
      .catch(e => { throw new Error(e.response.data.message) })
  },
  editPost (post, id, token) {
    return axios.put(`http://localhost:3000/api/editPost/${id}`, objectToFormData(post), { headers: { token } })
      .then(res => res.data)
      .catch(e => { throw new Error(e.response.data.message) })
  },
  removePost (id) {
    return axios.delete(`http://localhost:3000/api/removePost/${id}`)
      .then(res => res.data)
      .catch(e => { throw new Error(e.response.data.message) })
  }
}

export default postsApi
