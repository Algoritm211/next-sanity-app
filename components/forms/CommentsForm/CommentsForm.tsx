import React from 'react';
import {Field, Form} from "react-final-form";
import {requiredValidator} from "../validators";
import {Post} from "../../../typings";

interface FormInput {
  _id: string;
  name: string;
  email: string;
  comment: string;
}

interface Props {
  post: Post
}

export const CommentsForm: React.FC<Props> = ({post}) => {

  const onSubmit = async (values: FormInput) => {
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

  return (
    <Form<FormInput>
      initialValues={{
        _id: post._id
      }}
      onSubmit={onSubmit}
      render={({handleSubmit, form, errors, touched}) => {
        return (
          <form
            onSubmit={event => {
              handleSubmit(event)!.then(() => {
                form.restart()
              });
            }}
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
  );
};
