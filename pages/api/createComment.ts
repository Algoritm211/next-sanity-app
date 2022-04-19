import sanityClient from "@sanity/client";
import {NextApiRequest, NextApiResponse} from "next";

const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_API_TOKEN,
};


const client = sanityClient(config);

const createComment = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { _id, name, email, comment } = JSON.parse(req.body);

    await client.create({
      _type: 'comment',
      post: {
        _type: 'reference',
        _ref: _id,
      },
      name,
      email,
      comment
    })

    return res.status(200).json({message: 'Comment submitted'})
  } catch (error) {
    return res.status(500).json({message: 'Could`t submit comment', error})
  }

}

export default createComment;
