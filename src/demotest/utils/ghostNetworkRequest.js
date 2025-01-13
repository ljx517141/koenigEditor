import axios from 'axios';

function createAdminUrl(id, content, category, including) {
  let urlAdmin = `/ghost/api/${category ? category : 'admin/'}`;
  if (content) {
    urlAdmin = urlAdmin + `${content}`;
  }
  if (id) {
    urlAdmin = urlAdmin + `${id}/`;
  }
  if (including) {
    urlAdmin = urlAdmin + `?${including}`;
  }
  return urlAdmin;
}

// admin URL
export function getCreateAdminUrl() {
  return createAdminUrl(null, null);
}

// // Create token
// export function createToken() {
//   // Create a token without the client
//   const jwt = require('jsonwebtoken');

//   // Admin API key goes here
//   const key =
//     '677255655e6d610001c43053:9a5f06b05c00146d43ed4adbe4e2cf8b98eb47d2a227a3b7ac11bc17357913e1';

//   // Split the key into ID and SECRET
//   const [id, secret] = key.split(':');

//   // Create the token (including decoding secret)
//   const token = jwt.sign({}, Buffer.from(secret, 'hex'), {
//     keyid: id,
//     algorithm: 'HS256',
//     expiresIn: '10m',
//     audience: `/admin/`,
//   });
//   return token;
// }
// getYoutube
export function getFetchEmbedApi(url, type) {
  const apiUrl = createAdminUrl(null, 'oembed/');
  const headers = {
    withCredentials: true,
    'Content-Type': 'application/json',
  };
  const response = axios.get(apiUrl, {
    headers,
    params: { url, type },
  });
  return response;
}

// getAllPosts
export function getAllPosts(param, call) {
  // Make an authenticated request to create a post
  let url = createAdminUrl(null, 'posts/');
  const headers = { withCredentials: true };
  if (param) {
    url = url + param;
  }
  axios
    .get(url, headers)
    .then((response) => {
      call(null, response);
    })
    .catch((error) => {
      call(error, null);
    });
}

// getByidPosts
export function getByidPosts(id, call) {
  const url = createAdminUrl(id, 'posts/');
  const headers = { withCredentials: true };
  axios
    .get(url, { headers })
    .then((response) => {
      call(null, response);
    })
    .catch((error) => {
      call(error, null);
    });
}

// createByidPosts
export function createByidPosts(id, data, call) {
  // data 示例：status  null为草稿 not null 为发布帖子 || title 为必填选项 || lexical 为内容（null）
  // {
  //     title: "My test post",
  //     status: "published",
  //     feature_image: "https://example.com/image.jpg"
  // }
  // const headers = {
  //   'Content-Type': 'application/json',
  //   withCredentials: true,
  // };
  if (!data && !data.title) {
    return;
  }
  const url = createAdminUrl(id, 'posts/');
  axios
    .post(
      url,
      { posts: [data] },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    )
    .then((response) => {
      call(null, response);
    })
    .catch((error) => {
      call(error, null);
    });
}

// updateByidPosts
export function updateByidPosts(id, data, call) {
  // `data` 示例：updated_at 为必填选项  格式参照示例
  // {
  //     title: "My new title",
  //     updated_at: "2024-12-13T09:34:55.000Z",
  //     feature_image: "https://example.com/new-image.jpg",
  //     lexical: "json内容"
  // }
  // 若将 status 修改为 published 则为发布帖子
  // "status": "published"
  // 若将 status 修改为 scheduled 则为安排帖子(指定时间自动发布)
  // "status": "scheduled",
  // "published_at": "2023-06-10T11:00:00.000Z"  （time）

  const url = createAdminUrl(id, 'posts/');
  const headers = {
    withCredentials: true,
    'Content-Type': 'application/json',
  };
  axios
    .put(url, { posts: [data] }, { headers })
    .then((response) => {
      call(null, response);
    })
    .catch((error) => {
      call(error, null);
    });
}

// deleteByidPost
export function deleteByidPost(id, call) {
  const url = createAdminUrl(id, 'posts/');
  const headers = {
    withCredentials: true,
  };

  axios
    .delete(url, { headers })
    .then((response) => {
      call(null, response);
    })
    .catch((error) => {
      call(error, null);
    });
}

export function getContentByidPost(id, call) {
  const url = createAdminUrl(id, 'posts/', null, 'formats=html,lexical');
  const headers = {
    withCredentials: true,
  };

  axios
    .get(url, { headers })
    .then((response) => {
      call(null, response);
    })
    .catch((error) => {
      call(error, null);
    });
}
