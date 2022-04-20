import Link from 'next/link';
import React from 'react';
import { urlFor } from '../../sanity';
import {Post} from "../../typings";
import {PostDisplay} from "./PostDisplay";

interface Props {
  posts: Array<Post>
}

export const Posts: React.FC<Props> = ({posts}) => {
  const postBlock = posts.map((post) => {
    return (
      <PostDisplay post={post} />
    )
  });

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
    md:gap-6 p-3 md:p-6'>
      {postBlock}
    </div>
  );
};
