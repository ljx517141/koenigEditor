import { getFetchEmbedApi } from './ghostNetworkRequest';

export async function fetchEmbed(url, { type }) {
  console.log('fetchEmbed', { url, type }); // eslint-disable-line no-console
  let urlObject = new URL(url);
  if (!urlObject) {
    throw new Error('No URL specified.');
  }
  const response = await getFetchEmbedApi(url, type);
  if (response.status != 200) return;
  const contentData = response.data;
  console.log(response);
  // await delay(1500);
  try {
    if (type === 'bookmark') {
      let returnData = {
        url: contentData.url,
        metadata: {
          icon: contentData?.metadata.icon,
          title: contentData?.metadata.title,
          description: contentData?.metadata.description,
          publisher: contentData?.metadata.publisher,
          author: contentData?.metadata.author,
          thumbnail: contentData?.metadata.thumbnail,
        },
      };
      return returnData;
    } else {
      let returnData = {
        html: contentData?.html,
        author_url: contentData?.author_url,
        provider_name: contentData?.provider_name,
        title: contentData?.title,
        provider_url: contentData?.provider_url,
        author_name: contentData?.author_name,
        version: contentData?.version,
        thumbnail_url: contentData?.thumbnail_url,
        type: contentData?.type,
      };
      return returnData;
    }
  } catch (e) {
    // console.log(e);
  }
}
// Analog Delay
function delay(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}
