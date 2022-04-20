import React from 'react';
import Header from "../../components/Header/Header";
import {sanityClient, urlFor} from "../../sanity";
import {GetStaticPaths, GetStaticProps} from "next";
import PortableText from 'react-portable-text';
import { Post } from '../../typings';
import {CommentsForm} from "../../components/forms/CommentsForm/CommentsForm";
import Comments from "../../components/Comments/Comments";

interface Props {
  post: Post
}

const PostPage: React.FC<Props> = ({post}) => {

  return (
    <main>
      <Header />

      <img
        className='w-full h-40 object-cover'
        src={urlFor(post.mainImage).url()} alt='post_main_image' />

      <article className='max-w-3xl mx-auto p-5'>
        <h1 className='text-3xl mt-10 mb-3'>{post.title}</h1>
        <h2 className='text-xl font-light mb-2'>
          {post.description}
        </h2>

        <div className='flex items-center space-x-2'>
          <img
            className='h-10 w-10 rounded-full'
            src={urlFor(post.author.image).url()} alt='author' />
          <p className='font-extralight text-sm'>
            Post by <span className='text-green-600'>{post.author.name}</span> - Published at &nbsp;
            {new Date(post._createdAt).toLocaleString('ru-RU')}
          </p>
        </div>

        <div className='mt-10'>
          <PortableText
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
            content={post.body}
            serializers={{
              h1: (props: any) => {
                return (
                  <h1 className='text-2xl font-bold my-5' {...props}/>
                )
              },
              h2: (props: any) => {
                return (
                  <h2 className='text-2xl font-bold my-5' {...props}/>
                )
              },
              li: ({children}: any) => {
                return <li className='ml-4 list-disc'>{children}</li>
              },
              link: ({href, children}: any) => {
                return <a href={href} className='text-blue-500 hover:underline'>
                  {children}
                </a>
              }
            }}
          />
        </div>
      </article>

      <hr className='max-w-lg my-5 mx-auto border-yellow-500' />

      <CommentsForm post={post} />

      <Comments comments={post.comments}/>
    </main>
  );
};

export default PostPage

export const getStaticPaths: GetStaticPaths = async () => {
  const query = `*[_type == 'post'] {
    _id,
    slug {
      current
    }
  }`;

  const posts = await sanityClient.fetch(query);

  const paths = posts.map((post: Post) => {
    return {
      params: {
        slug: post.slug.current
      }
    }
  })

  return {
    paths,
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async ({params}) => {

  const query = `*[_type == 'post' && slug.current == $slug][0] {
     _id,
    _createdAt,
    title,
    author -> {
      name,
      image,
    },
    'comments': *[
    _type == 'comment' 
    && post._ref == ^._id
    && approved == true],
    description,
    mainImage,
    slug,
    body,
  }`;

  const post = await sanityClient.fetch(query, {
    slug: params?.slug
  })

  if (!post) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      post
    },
    revalidate: 60 * 60 * 12, // Every 12 hours
  }
}
