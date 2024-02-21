import { Hono } from 'hono'
import { renderer } from './renderer'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

const app = new Hono<{ Bindings: { DB: D1Database } }>()

app.get('*', renderer)

app.get('/', (c) => {
  return c.render(<h1>Hello!</h1>)
})

const createPostSchema = z.object({
  title: z.string(),
  body: z.string(),
})

app.post('/posts', zValidator('form', createPostSchema), async (c) => {
  const { title, body } = c.req.valid('form')
  const sql = 'INSERT INTO posts (title, body) VALUES (?, ?)'
  await c.env.DB.prepare(sql).bind(title, body).run()
  return c.redirect('/posts')
})

const PostForm = () => (
  <form method='post' action='/posts'>
    <input name='title' placeholder='title' />
    <input name='body' placeholder='body' />
    <button>Post</button>
  </form>
)

type Post = {
  title: string
  body: string
}

const PostsList = ({ posts }: { posts: Post[] }) => (
  <div>
    {posts.map((post) => (
      <div>
        <div>Title3: {post.title}</div>
        <div>Body: {post.body}</div>
        <hr />
      </div>
    ))}
  </div>
)

app.get('/posts', async (c) => {
  const posts = await c.env.DB.prepare('SELECT * FROM posts').all<Post>()
  return c.render(
    <div>
      <PostForm />
      <PostsList posts={posts.results} />
    </div>
  )
})

export default app
