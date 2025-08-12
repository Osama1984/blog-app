import { PrismaClient, Role, PostStatus } from '@prisma/client'
import { faker } from '@faker-js/faker'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// US States for user addresses
const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
]

// Category colors
const CATEGORY_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#F4D03F',
  '#AED6F1', '#A9DFBF', '#F9E79F', '#D7BDE2', '#A3E4D7'
]

// Sample blog topics
const BLOG_TOPICS = [
  'Technology', 'Programming', 'Web Development', 'Mobile Apps', 'AI & Machine Learning',
  'Data Science', 'Cybersecurity', 'Cloud Computing', 'DevOps', 'Software Engineering',
  'UI/UX Design', 'Digital Marketing', 'SEO', 'Content Marketing', 'Social Media',
  'E-commerce', 'Entrepreneurship', 'Startup', 'Business Strategy', 'Leadership',
  'Personal Development', 'Productivity', 'Health & Wellness', 'Fitness', 'Nutrition',
  'Travel', 'Photography', 'Art & Design', 'Music', 'Books & Literature',
  'Education', 'Science', 'Environment', 'Sustainability', 'Finance',
  'Investing', 'Cryptocurrency', 'Real Estate', 'Career Development', 'Remote Work',
  'Gaming', 'Sports', 'Food & Cooking', 'Lifestyle', 'Fashion',
  'Home & Garden', 'DIY', 'Parenting', 'Relationships', 'Mental Health'
]

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clear existing data
  console.log('🧹 Cleaning existing data...')
  await prisma.postImage.deleteMany()
  await prisma.like.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.postTag.deleteMany()
  await prisma.postCategory.deleteMany()
  await prisma.post.deleteMany()
  await prisma.tag.deleteMany()
  await prisma.category.deleteMany()
  await prisma.account.deleteMany()
  await prisma.session.deleteMany()
  await prisma.user.deleteMany()

  // Create 50 users
  console.log('👥 Creating 50 users...')
  const users = []
  
  // Create a default password for all users (hashed)
  const defaultPassword = await bcrypt.hash('password123', 12)
  
  for (let i = 0; i < 50; i++) {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    const email = faker.internet.email({ firstName, lastName }).toLowerCase()
    
    const user = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        email: email,
        password: defaultPassword, // All users will have password 'password123'
        emailVerified: faker.datatype.boolean() ? faker.date.past() : null,
        image: faker.image.avatar(),
        bio: faker.lorem.sentence({ min: 5, max: 15 }),
        role: i < 5 ? Role.ADMIN : Role.USER, // First 5 users are admins
        createdAt: faker.date.past({ years: 2 }),
        updatedAt: faker.date.recent()
      }
    })
    users.push(user)
  }

  // Create 50 categories
  console.log('📂 Creating 50 categories...')
  const categories = []
  for (let i = 0; i < 50; i++) {
    const topic = BLOG_TOPICS[i]
    const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    
    const category = await prisma.category.create({
      data: {
        name: topic,
        slug: slug,
        description: faker.lorem.words({ min: 3, max: 8 }),
        color: faker.helpers.arrayElement(CATEGORY_COLORS),
        // image: faker.image.url({ width: 400, height: 300, category: 'abstract' }), // Add back when schema updated
        createdAt: faker.date.past({ years: 1 }),
        updatedAt: faker.date.recent()
      }
    })
    categories.push(category)
  }

  // Create tags (we'll create some based on common programming and tech terms)
  console.log('🏷️ Creating tags...')
  const tagNames = [
    'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Python', 'Java', 'C++',
    'HTML', 'CSS', 'Tailwind', 'Bootstrap', 'Vue.js', 'Angular', 'PHP', 'Laravel',
    'Django', 'Flask', 'Ruby', 'Rails', 'Go', 'Rust', 'Swift', 'Kotlin',
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'MongoDB', 'PostgreSQL', 'MySQL',
    'Redis', 'GraphQL', 'REST API', 'Machine Learning', 'Deep Learning', 'AI',
    'Blockchain', 'Cryptocurrency', 'NFT', 'Web3', 'Tutorial', 'Guide',
    'Tips', 'Best Practices', 'Performance', 'Security', 'Testing', 'DevOps'
  ]
  
  const tags = []
  for (const tagName of tagNames) {
    const slug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const tag = await prisma.tag.create({
      data: {
        name: tagName,
        slug: slug,
        createdAt: faker.date.past({ years: 1 }),
        updatedAt: faker.date.recent()
      }
    })
    tags.push(tag)
  }

  // Create 50 posts
  console.log('📝 Creating 50 posts...')
  const posts = []
  for (let i = 0; i < 50; i++) {
    const title = faker.lorem.sentence({ min: 3, max: 8 }).replace('.', '')
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const author = faker.helpers.arrayElement(users)
    const publishedAt = faker.datatype.boolean() ? faker.date.past({ years: 1 }) : null
    const status = publishedAt ? PostStatus.PUBLISHED : PostStatus.DRAFT
    
    const post = await prisma.post.create({
      data: {
        title: title,
        slug: slug,
        excerpt: faker.lorem.sentence({ min: 5, max: 15 }),
        content: generateBlogContent(),
        coverImage: `https://dummyimage.com/800x400/6366f1/ffffff&text=Post+${i + 1}`,
        status: status,
        featured: faker.datatype.boolean({ probability: 0.1 }), // 10% chance of being featured
        publishedAt: publishedAt,
        authorId: author.id,
        createdAt: faker.date.past({ years: 1 }),
        updatedAt: faker.date.recent()
      }
    })
    posts.push(post)

    // Add random categories to each post (1-3 categories)
    const postCategories = faker.helpers.arrayElements(categories, { min: 1, max: 3 })
    for (const category of postCategories) {
      await prisma.postCategory.create({
        data: {
          postId: post.id,
          categoryId: category.id
        }
      })
    }

    // Add random tags to each post (2-6 tags)
    const postTags = faker.helpers.arrayElements(tags, { min: 2, max: 6 })
    for (const tag of postTags) {
      await prisma.postTag.create({
        data: {
          postId: post.id,
          tagId: tag.id
        }
      })
    }

    // Add some post images (0-3 additional images per post)
    const imageCount = faker.number.int({ min: 0, max: 3 })
    for (let j = 0; j < imageCount; j++) {
      await prisma.postImage.create({
        data: {
          postId: post.id,
          url: `https://dummyimage.com/600x400/8b5cf6/ffffff&text=Gallery+${j + 1}`,
          alt: faker.lorem.words(3),
          caption: faker.lorem.sentence(),
          order: j,
          createdAt: faker.date.recent(),
          updatedAt: faker.date.recent()
        }
      })
    }

    // Add some comments (0-10 comments per post)
    const commentCount = faker.number.int({ min: 0, max: 10 })
    for (let j = 0; j < commentCount; j++) {
      const commenter = faker.helpers.arrayElement(users)
      await prisma.comment.create({
        data: {
          content: faker.lorem.paragraphs({ min: 1, max: 3 }),
          authorId: commenter.id,
          postId: post.id,
          createdAt: faker.date.recent({ days: 30 }),
          updatedAt: faker.date.recent()
        }
      })
    }

    // Add some likes (0-20 likes per post)
    const likeCount = faker.number.int({ min: 0, max: 20 })
    const likers = faker.helpers.arrayElements(users, likeCount)
    for (const liker of likers) {
      try {
        await prisma.like.create({
          data: {
            userId: liker.id,
            postId: post.id,
            createdAt: faker.date.recent({ days: 30 })
          }
        })
      } catch {
        // Skip duplicate likes
      }
    }
  }

  console.log('✅ Database seeding completed!')
  console.log(`📊 Created:`)
  console.log(`   - 50 users (5 admins, 45 regular users)`)
  console.log(`   - 50 categories with images`)
  console.log(`   - ${tags.length} tags`)
  console.log(`   - 50 posts with cover images`)
  console.log(`   - Additional post images`)
  console.log(`   - Random comments and likes`)
}

function generateBlogContent(): string {
  const paragraphs = []
  const paragraphCount = faker.number.int({ min: 5, max: 12 })
  
  for (let i = 0; i < paragraphCount; i++) {
    paragraphs.push(faker.lorem.paragraph({ min: 3, max: 8 }))
  }
  
  return paragraphs.join('\n\n')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
