const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')


beforeEach(async () => {
    await Blog.deleteMany({})
    // console.log('cleared')

    for (let blog of helper.initialBlogs) {
        let blogObject = new Blog(blog)
        await blogObject.save()
        // console.log('saved')
    }
    // console.log('done')
})


describe('GET all', () => {

    test('blogs are returned as json', async () => {
        await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    }, 100000)


    test('all blogs are returned', async() => {
        const response = await api.get('/api/blogs')

        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })


    test('a specific blog is within the returned blogs', async () => {
        const response = await api.get('/api/blogs')

        const titles = response.body.map(r => r.title)
        expect(titles).toContain(
            'Test blog 1'
        )
    })

    test('a blog has a property \'id\'', async () => {
        const response = await api.get('/api/blogs')
        const id = response.body[0].id
        expect(id).toBeDefined()
    })

})


describe('GET a specific note', () => {
    test('succeeds with valid id', async () => {
        const blogsAtStart = await helper.blogsInDb()

        const blogToView = blogsAtStart[0]

        const resultBlog = await api
            .get(`/api/blogs/${blogToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(resultBlog.body).toEqual(blogToView)

    })

    test('fails with status 404 if blog does not exist', async () => {
        const validNonExistingId = await helper.nonExistingId()

        await api
            .get(`/api/blogs/${validNonExistingId}`)
            .expect(404)
    })

    test('fails with status 400 if id is invalid', async () => {
        const invalidId = '5a3d5da59070081a82a3445'

        await api
            .get(`/api/blogs/${invalidId}`)
            .expect(400)
    })
})


describe('POST', () => {

    test('a blog gets added to the list', async () => {
        const newBlog = {
            title: 'Latest blog',
            author: 'The Tester',
            url: 'www.test.com/blog',
            likes: 12
        }

        await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

        const titles = blogsAtEnd.map(r => r.title)
        expect(titles).toContain('Latest blog')
    })

    test('likes default to zero if not specified', async () => {
        const newBlog = {
            title: 'Testing without likes',
            author: 'Arthur C',
            url: 'www.test.com/nolikes'
        }

        await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

        const likes = blogsAtEnd.map(r => r.likes)
        expect(likes[2]).toBe(0)

    })

    test('if title is missing, server responds with 400 Bad Request', async () => {
        const newBlog = {
            author: 'Harry Potter',
            url: 'www.hogwarts.com/harry',
        }

        await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    }, 10000)

    test('if author is missing, server responds with 400 Bad Request', async () => {
        const newBlog = {
            title: 'How I beat Voldemort',
            url: 'www.hogwarts.com/harry',
        }

        await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    }, 100000)
})

describe('DELETE', () => {

    test('A blog can be deleted and deletion results in status code 204', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

        const titles = blogsAtEnd.map(r => r.title)
        expect(titles).not.toContain(blogToDelete.title)

    }, 100000)
})


describe('PUT', () => {

    test('A blog can updated', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]

        const updatedVersion = {
            title: 'Test blog 11',
            author: 'Test author 1',
            url: 'www.google.com/testblog1',
            likes: 22,
            id: blogToUpdate.id
        }

        await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedVersion)
        .expect(200)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

        expect(blogsAtEnd[0]).toEqual(updatedVersion)
        const titles = blogsAtEnd.map(r => r.title)
        expect(titles).toContain(updatedVersion.title)

        const likes = blogsAtEnd.map(r => r.likes)
        expect(likes[0]).toEqual(updatedVersion.likes)

    }, 100000)
})


afterAll(async () => {
    await mongoose.connection.close()
})
