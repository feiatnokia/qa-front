import modelExtend from 'dva-model-extend';
import { routerRedux } from 'dva/router';
import { DEFAULT_PAGINATION } from '@/constants/Pagination';

const completionPagination = pagination => ({
  ...pagination,
  total: parseInt(pagination.total, 10) || 0,
});

const model = {
  reducers: {
    updateState(state, { payload = {} }) {
      if (payload && 'pagination' in payload) {
        const pagination = DEFAULT_PAGINATION;
        // eslint-disable-next-line
        payload.pagination = {
          pageSize: payload.pageSize,
          current: payload.current,
          ...pagination,
          ...completionPagination(payload.pagination),
        };
      }
      return {
        ...state,
        ...payload,
      };
    },
  },
};

const utilModel = modelExtend(model, {
  state: {
    pagination: DEFAULT_PAGINATION,
  },
  effects: {
    *routerPush({ payload }, { put }) {
      if (window.location.hash !== `#${payload}`) {
        yield put(routerRedux.push(payload));
      }
    },
    *goBack(action, { put }) {
      yield put(routerRedux.goBack());
    },
    *resetPagination({ type }, { put, select }) {
      const types = type.split('/');
      const namespace = types.slice(0, types.length - 1).join('/');

      const { pagination } = yield select(state => state[namespace]);
      yield put({
        type: 'updateState',
        payload: {
          pagination: {
            ...DEFAULT_PAGINATION,
            pageSize: pagination.pageSize,
          },
        },
      });
    },
  },
});

export { model, utilModel };

export default {
  namespace: 'common',

  state: {
    authCodes: [],
    menus: [],
    currentUser: {},
  },

  effects: {
    *fetchCurrent(_, { put }) {
      let data = {};
      try {
        data = JSON.parse(window.localStorage.getItem('user'));
      } catch (error) {
        data = {};
      }
      yield put({ type: 'fetchMenu' });
      yield put({ type: 'fetchAuthCode' });
      yield put({
        type: 'saveCurrentUser',
        payload: data,
      });
    },
  },

  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
