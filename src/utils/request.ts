import fetch from 'dva/fetch';
import { stringify } from 'qs';
import cloneDeepWith from 'lodash/cloneDeepWith';
import { isEmptyObject, isSuccess } from '@/utils/utils';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

const checkStatus = (response : any) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  if (response.status === 401) {
    // eslint-disable-next-line no-underscore-dangle
    // router.push('/user/login');
  }

  if (response.status === 403) {
    // store.dispatch(routerRedux.push('/exception/403'));
  }

  if (response.status <= 504 && response.status >= 500) {
    // store.dispatch(routerRedux.push('/exception/500'));
  }

  if (response.status >= 404 && response.status < 422) {
    // store.dispatch(routerRedux.push('/exception/404'));
  }

  const errortext = codeMessage[response.status] || response.statusText;
  const error : any = new Error(errortext);
  error.response = response;
  throw error;
};

const checkSuccess = (data : any) => {
  if (typeof data === 'string') {
    return data;
  }

  if (isSuccess(data)) {
    return data;
  }

  const error : any = new Error(data.message);
  error.data = data;
  throw error;
};

const throwError = (err : any) => {
  throw err;
};

const trim = (value : any) => {
  if (typeof value === 'string') {
    return value.trim();
  }
  return value;
};

const createUrl = (url : string, params : any) => {
  const reg = /\/:(\w+)/;
  let match = reg.exec(url) || [];
  let colon = match[0];
  let param = match[1];
  let targetUrl = url;
  const undealParams = { ...cloneDeepWith(params, trim) };
  while (param && params) {
    if (params[param]) {
      targetUrl = url.replace(colon, `/${params[param]}`);
      delete undealParams[param];
    } else {
      break;
    }
    match = reg.exec(targetUrl) || [];
    colon = match[0]; // eslint-disable-line
    param = match[1]; // eslint-disable-line
  }

  return { url: targetUrl, params: undealParams || {} };
};

const setServerUrl = (url : string) => {
  const baseUrl = 'http://localhost:8081/qa/'
  return baseUrl + url;
};

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
const request = (url : string, options : any) => {
  const defaultOptions = {
    credentials: 'include',
    headers: {
      Authorization: 'auth',
      // Authorization: `Bearer ${localStorage.token}`,
    },
  };
  const newOptions = { ...defaultOptions, ...options };
  if (
    newOptions.method === 'POST' ||
    newOptions.method === 'PUT' ||
    newOptions.method === 'DELETE'
  ) {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
      };
    }
  }

  return fetch(setServerUrl(url), newOptions)
    .then(checkStatus)
    .then(response => {
      // if (newOptions.method === 'DELETE' || response.status === 204) {
      //   return response.text();
      // }
      return response.json();
    })
    .then(checkSuccess)
    .catch(throwError);
};

/**
 *
 * @param {String} url
 * @param {Object} params 包含query参数以及:开头的参数
 * @param {Object} options
 */
export const get = (url : string, params = {}, options = {}) => {
  const { url: realUrl, params: data } = createUrl(url, params);
  const queryString = isEmptyObject(data) ? '' : `?${stringify(data)}`;
  return request(`${realUrl}${queryString}`, {
    ...options,
    method: 'GET',
  });
};

/**
 *
 * @param {String} url
 * @param {Object} data 包含body数据及:开头的参数
 * @param {Object} options
 */
export const post = (url : string, data = {}, options = {}) => {
  const { url: realUrl, params: body } = createUrl(url, data);
  return request(realUrl, {
    ...options,
    method: 'POST',
    body,
  });
};

/**
 *
 * @param {String} url
 * @param {Object} data 包含body数据及:开头的参数
 * @param {Object} options
 */
export const $delete = (url : string, data = {}, options = {}) => {
  const { url: realUrl, params: body } = createUrl(url, data);
  return request(realUrl, {
    ...options,
    method: 'DELETE',
    body,
  });
};

/**
 *
 * @param {String} url
 * @param {Object} data 包含body数据及:开头的参数
 * @param {Object} options
 */
export const $put = (url : string, data = {}, options = {}) => {
  const { url: realUrl, params: body } = createUrl(url, data);
  return request(realUrl, {
    ...options,
    method: 'PUT',
    body,
  });
};

export default request;
