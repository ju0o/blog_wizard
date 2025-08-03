// src/main/tistory.ts

import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

export async function publishToTistory({ title, content }: { title: string, content: string }) {
  const accessToken = process.env.TISTORY_ACCESS_TOKEN;
  const blogName = process.env.TISTORY_BLOG_NAME;

  const url = `https://www.tistory.com/apis/post/write?access_token=${accessToken}&output=json&blogName=${blogName}&title=${encodeURIComponent(title)}&content=${encodeURIComponent(content)}`;
  const res = await axios.post(url);
  return res.data;
}
