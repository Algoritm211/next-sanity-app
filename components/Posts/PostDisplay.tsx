import React from 'react';
import {urlFor} from "../../sanity";
import Link from "next/link";
import {Post} from "../../typings";

interface Props {
  post: Post
}

export const PostDisplay: React.FC<Props> = ({post}) => {
  return (
    <Link key={post._id} href={`/post/${post.slug.current}`}>
      <div className='border rounded-lg group cursor-pointer overflow-hidden'>
        <div className="overflow-hidden">
          <img
          className='h-60 w-full object-cover group-hover:scale-105
             transition-transform duration-400'
          src={
            urlFor(post.mainImage).url()
          } alt='post_image'
        />
        </div>
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
  );
};
