import {extend} from "umi-request";

const request = extend({
  credentials: 'include', // 默认请求是否带上cookie
});

export async function query(): Promise<any> {
  return request('/api/users');
}

export async function queryCurrent(): Promise<any> {
  return request('/api/currentUser');
}

export async function queryNotices(): Promise<any> {
  return request('/api/notices');
}
