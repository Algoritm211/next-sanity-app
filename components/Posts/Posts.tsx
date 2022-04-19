import Link from 'next/link';
import React from 'react';
import { urlFor } from '../../sanity';
import {Post} from "../../typings";

interface Props {
  posts: Array<Post>
}

export const Posts: React.FC<Props> = ({posts}) => {
  const postBlock = posts.map((post) => {
    //TODO Make separate component
    return (
      <Link key={post._id} href={`/post/${post.slug.current}`}>
        <div className='border rounded-lg group cursor-pointer overflow-hidden'>
          <img
            className='h-60 w-full object-cover group-hover:scale-105
             transition-transform duration-400 ea'
            src={
              urlFor(post.mainImage).url()
            } alt='post_image'
          />
          <div className='flex justify-between p-5 bg-white group-hover:bg-gray-100'>
            <div>
              <p className='text-lg font-bold'>{post.title}</p>
              <p className='text-xs'>{post.description} by {post.author.name}</p>
            </div>

            <img
              className='w-12 h-12 rounded-full'
              src={urlFor(post.author.image).url()} alt='author_image' />
          </div>
        </div>

      </Link>
    )
  });

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
    md:gap-6 p-3 md:p-6'>
      {postBlock}
    </div>
  );
};
