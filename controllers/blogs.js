const blogsRouter = require('express').Router()
const Blog = require('../models/blog')


blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})


blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
        response.json(blog)
    } else {
        response.status(404).end()
    }

})



blogsRouter.post('/', async (request, response) => {
    const body = request.body
    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0
    })
    if (!blog.title || !blog.author) {
        response.status(400).end()
    }

    else {
        const result = await blog.save()
        response.status(201).json(result)
    }


})

blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndDelete(request.params.id)
    // console.log(deletedBlog)
    // if (deletedBlog) {
    //     response.status(204).end()
    // } else {
    //     response.status(410).json({ error: 'error - could not delete resource' })
    // }
    response.status(204).end()

})

blogsRouter.put('/:id', async (request, response) => {

    const body = request.body
    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog)
    response.json(updatedBlog)

})


module.exports = blogsRouter
