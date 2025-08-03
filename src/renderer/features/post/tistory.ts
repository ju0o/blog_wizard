// src/renderer/features/post/tistory.ts

import axios from 'axios';

export async function publishToTistory(title: string, content: string, accessToken: string, blogName: string) {
  const url = `https://www.tistory.com/apis/post/write?access_token=${accessToken}&output=json&blogName=${blogName}&title=${encodeURIComponent(title)}&content=${encodeURIComponent(content)}`;
  const res = await axios.post(url);
  return res.data;
}
