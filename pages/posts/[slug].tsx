import Head from 'next/head'
import ErrorPage from 'next/error'
import { useRouter } from 'next/router'

import type PostType from '../../interfaces/post'

import Header from '../../components/header'
import Layout from '../../components/layout'
import Container from '../../components/container'
import PostBody from '../../components/post-body'
import PostTitle from '../../components/post-title'
import PostHeader from '../../components/post-header'

import { CMS_NAME } from '../../lib/constants'
import { useComments } from '../../lib/useComments'
import markdownToHtml from '../../lib/markdownToHtml'
import { getPostBySlug, getAllPosts } from '../../lib/api'

type Props = {
  post: PostType
  morePosts: PostType[]
  preview?: boolean
}

export default function Post({ post, morePosts, preview }: Props) {
  const comments = useComments("https://united-bear-12.hasura.app/v1/graphql", post.slug)

  console.log(comments);

  const router = useRouter()

  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />
  }

  return (
    <Layout preview={preview}>
      <Container>
        <Header />
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <article className="mb-32">
              <Head>
                <title>
                  {post.title} | Next.js Blog Example with {CMS_NAME}
                </title>
                <meta property="og:image" content={post.ogImage.url} />
              </Head>
              <PostHeader
                title={post.title}
                coverImage={post.coverImage}
                date={post.date}
                author={post.author}
              />
              <PostBody content={post.content} />
            </article>
          </>
        )}
      </Container>
    </Layout>
  )
}

type Params = {
  params: {
    slug: string
  }
}

export async function getStaticProps({ params }: Params) {
  const post = getPostBySlug(params.slug, [
    'title',
    'date',
    'slug',
    'author',
    'content',
    'ogImage',
    'coverImage',
  ])
  const content = await markdownToHtml(post.content || '')

  return {
    props: {
      post: {
        ...post,
        content,
      },
    },
  }
}

export async function getStaticPaths() {
  const posts = getAllPosts(['slug'])

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      }
    }),
    fallback: false,
  }
}