import {
  createClient,
  createCurrentUserHook,
} from 'next-sanity';
import createImageUrlBuilder from '@sanity/image-url'

export const config = {
  /**
   * Find your project ID and dataset in `sanity.json` in your studio project.
   * These are considered “public”, but you can use environment variables
   * if you want differ between local dev and production.
   *
   * https://nextjs.org/docs/basic-features/environment-variables
   **/
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  apiVersion: '2021-10-21', // Learn more: https://www.sanity.io/docs/api-versioning
  /**
   * Set useCdn to `false` if your application require the freshest possible
   * data always (potentially slightly slower and a bit more expensive).
   * Authenticated request (like preview) will always bypass the CDN
   **/
  useCdn: process.env.NODE_ENV === 'production',
}

// Setup client for fetching data
export const sanityClient = createClient(config);

// Setup helper function for generating image urls
export const urlFor = (source) => {
  return createImageUrlBuilder(config).image(source)
}

export const useCurrentUser = createCurrentUserHook(config)

