const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

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

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
})


describe('GET', () => {

    test('blogs are returned as json', async () => {
        await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    }, 100000)


    test('all blogs are returned', async() => {
        const response = await api.get('/api/blogs')

        expect(response.body).toHaveLength(initialBlogs.length)
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

        const response = await api.get('/api/blogs')
        const titles = response.body.map(r => r.title)

        expect(response.body).toHaveLength(initialBlogs.length + 1)
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

        const response = await api.get('/api/blogs')
        const likes = response.body.map(r => r.likes)
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

afterAll(async () => {
    await mongoose.connection.close()
})
