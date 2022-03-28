import type {GetServerSidePropsContext, NextPage} from 'next'
import Head from 'next/head'
import Header from '../components/Header/Header'
import { sanityClient } from '../sanity';
import { Post } from '../typings';
import {Posts} from "../components/Posts/Posts";

interface Props {
  posts: Array<Post>
}

const Home: NextPage<Props> = ({posts}) => {
  return (
    <div className='max-w-7xl mx-auto'>
      <Head>
        <title>Horbunov Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <div className='flex justify-between items-center
      bg-yellow-100 border border-black py-10 lg:py-0'>
        <div className='px-10 space-y-5'>
          <h1 className='text-6xl max-w-xl font-serif'>
            <span className='hover:underline'>Medium</span> is a place to write, read and connect
          </h1>
          <h2>
            It's easy and free to post your thinking on any topic and connect with million of readers
          </h2>
        </div>
        <img className='hidden md:flex h-32 lg:h-full'
             src='https://accountabilitylab.org/wp-content/uploads/2020/03/Medium-logo.png'
             alt='medium_logo_preview' />
      </div>

      {/* Posts */}
      <Posts posts={posts} />
    </div>
  )
}

export default Home


export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const query = `*[_type == 'post'] {
    _id,
    title,
    slug,
    author -> {
    name,
    image
  },
   description,
   mainImage
  }`;

  const posts = await sanityClient.fetch(query);

  return {
    props: {
      posts,
    }
  }
}
