import { getAllPosts } from "../DB/posts.mjs"

export async function getPostsList(req, res, next) {
  try {
    const posts = await getAllPosts()
    res.status(200).json({ data: posts, message: 'Okay' })
  } catch (err) {
    res.status(500).json({ message: "Une erreur s'est produite" })
  }
}
