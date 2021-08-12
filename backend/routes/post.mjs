import { postsCreate } from '../DB/posts.mjs'
import { getAllPosts } from '../DB/posts.mjs'

export async function getPostsList(req, res, next) {
  try {
    const posts = await getAllPosts()
    res.status(200).json({ data: posts, message: 'Okay' })
  } catch (err) {
    res.status(500).json({ message: "Une erreur s'est produite" })
  }
}

// Appeler la fonction POST
export async function postCreate(req, res, next) {
  try {
    const {userId, title, text} = req.body
    const result = await postsCreate(userId, title, text)
    res.status(201).json({ data: result, message: "C'est fonctionnel" })
  } catch (err) {
    res.status(500).json({ message: "Une erreur s'est produite" })
  }
}

/*
req.body = { userid: tittle: text:}
newPost = { userid : req.body;userid
const newPost = {...req.body}
const result = await postsCreate(newPost.userId, newPost.title, newPost.text)
*/
