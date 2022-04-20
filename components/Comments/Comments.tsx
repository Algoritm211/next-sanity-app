import React from 'react';
import {Post} from "../../typings";

interface Props {
  comments: Post['comments']
}

const Comments: React.FC<Props> = ({comments}) => {

  const commentsBlock = comments.map((comment) => {
    return (
      <div key={comment._id}>
        <p>
          <span className='text-yellow-500'>{comment.name}:</span> {comment.comment}
        </p>
      </div>
    )
  })

  return (
    <div
      className='flex flex-col my-10 p-10 max-w-2xl mx-auto
        shadow-lg space-y-2'
    >
      <h3 className='text-4xl'>Comments</h3>
      <hr className='pb-2' />
      {commentsBlock}
    </div>
  );
};

export default Comments;
