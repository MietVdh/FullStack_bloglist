const Blog = require('../models/blog')
const User = require('../models/user')


const initialBlogs = [
    {
        title: 'Test blog 1',
        author: 'Test author 1',
        url: 'www.google.com/testblog1',
        likes: 2
    },
    {
        title: 'Test blog 2',
        author: 'Test author 2',
        url: 'www.google.com/testblog2',
        likes: 5
    }
]

const nonExistingId = async () => {
    const blog = new Blog({ title: 'Will remove', author: 'Will Remove' })
    await blog.save()
    await blog.deleteOne()

    return blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
  }



module.exports = {
    initialBlogs, nonExistingId, blogsInDb, usersInDb
}
