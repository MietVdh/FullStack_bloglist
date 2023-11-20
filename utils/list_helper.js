const dummy = (blogs) => {
  return 1
}


const totalLikes = (blogs) => {
  return blogs.reduce((prev, curr) => {
    return prev + curr.likes
  }, 0)
}


const favoriteBlog = (blogs) => {
  if (blogs.length === 0)  { return null }
  let bestBlog = blogs[0]
  let mostLikes = blogs[0].likes
  blogs.forEach(blog => {
    if (blog.likes > mostLikes) {
      bestBlog = blog
      mostLikes = blog.likes
    }
  })
  return bestBlog
}


const mostBlogs = (blogs) => {
  // return author with most blogs as well as their blog count - use Lodash?
  /*
  {
    author: "Robert C. Martin",
    blogs: 3
  }
*/
  if (blogs.length === 0) {
    return null
  }

  let authors = {}
  blogs.forEach(b => {
    if (Object.keys(authors).includes(b.author)) {
      authors[b.author] += 1
    }
    else {
      authors[b.author] = 1
    }
  })

  let maxAuth = null
  let maxCount = 0
  for (const [key, value] of Object.entries(authors)) {
    if (value > maxCount) {
      maxCount = value
      maxAuth = key
    }
  }

  return ({
    author: maxAuth,
    blogs: maxCount
  })


}

const mostLikes = (blogs) => {
  // return author with most likes as well as their like count
  /*
  {
    author: "Edsger W. Dijkstra",
    likes: 17
  }
  */

  if (blogs.length === 0) {
    return null
  }

  let authors = {}
  blogs.forEach(b => {
    if (Object.keys(authors).includes(b.author)) {
      authors[b.author] += b.likes
    }
    else {
      authors[b.author] = b.likes
    }
  })

  let maxAuth = null
  let maxCount = 0
  for (const [key, value] of Object.entries(authors)) {
    if (value > maxCount) {
      maxCount = value
      maxAuth = key
    }
  }

  return ({
    author: maxAuth,
    likes: maxCount
  })
}


module.exports = {
dummy,
totalLikes,
favoriteBlog,
mostBlogs,
mostLikes
}
