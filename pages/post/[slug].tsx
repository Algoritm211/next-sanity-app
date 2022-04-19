import React from 'react';
import Header from "../../components/Header/Header";
import {sanityClient, urlFor} from "../../sanity";
import {GetStaticPaths, GetStaticProps} from "next";
import PortableText from 'react-portable-text';
import {Field, Form } from 'react-final-form';
import {requiredValidator} from "../../components/forms/validators";
import { Post } from '../../typings';

interface FormInput {
  _id: string;
  name: string;
  email: string;
  comment: string;
}

interface Props {
  post: Post
}

const PostPage: React.FC<Props> = ({post}) => {

  const onSubmit = (values: FormInput) => {
    console.log(values)
    fetch('/api/createComment', {
      method: 'POST',
      body: JSON.stringify(values)
    })
      .then((res) => {
        console.log(res)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const commentsBlock = post.comments.map((comment) => {
    return (
      <div key={comment._id}>
        <p>
          <span className='text-yellow-500'>{comment.name}:</span> {comment.comment}
        </p>
      </div>
    )
  })

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

      <Form<FormInput>
        initialValues={{
          _id: post._id
        }}
        onSubmit={onSubmit}
        render={({handleSubmit, errors, touched}) => {
          return (
            <form
              onSubmit={handleSubmit}
              className='flex flex-col p-10 max-w-2xl mx-auto mb-10'>
              <h3 className='text-sm text-yellow-500'>Enjoyed this article?</h3>
              <h4 className='text-3xl font-bold'>Leave the comment below!</h4>
              <hr className='py-3 mt-2' />

              <label className='block mb-5'>
                <span className='text-gray-700'>Name</span>
                <Field
                  name='name'
                  component='input'
                  className='shadow border rounded py-2 px-3 mt-1 block w-full
            ring-yellow-500 focus:ring outline-none'
                  placeholder='Alex Horbunov'
                  validate={requiredValidator}
                  type='text' />
                {touched?.name && <span className='text-red-500'>{errors?.name}</span>}
              </label>
              <label className='block mb-5'>
                <span className='text-gray-700'>Email</span>
                <Field
                  name='email'
                  component='input'
                  className='shadow border rounded py-2 px-3 mt-1 block w-full
            ring-yellow-500 focus:ring outline-none'
                  placeholder='yourEmail@some.com'
                  validate={requiredValidator}
                  type='text' />
                {touched?.email && <span className='text-red-500'>{errors?.email}</span>}
              </label>
              <label className='block mb-5'>
                <span>Comment</span>
                <Field
                  name='comment'
                  component='textarea'
                  className='shadow border rounded py-2 px-3 mt-1 block w-full
            ring-yellow-500 focus:ring outline-none'
                  placeholder='Your Comment...'
                  validate={requiredValidator}
                  rows={8} />
                {touched?.comment && <span className='text-red-500'>{errors?.comment}</span>}
              </label>

              <button
                type='submit'
                className='shadow outline-none text-white
                bg-yellow-500 hover:bg-yellow-400 focus:bg-yellow-400
                font-bold rounded py-2 focus:outline-none'
              >
                Submit
              </button>
            </form>
          )
        }}
      />

      {/* Comments */}
      <div
        className='flex flex-col my-10 p-10 max-w-2xl mx-auto
        shadow-lg space-y-2'
      >
        <h3 className='text-4xl'>Comments</h3>
        <hr className='pb-2' />
        {commentsBlock}
      </div>
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
