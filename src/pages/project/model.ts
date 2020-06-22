import { Effect, Reducer } from 'umi';

import { CardListItemDataType } from './data.d';
import { queryProjectList } from './service';

export interface StateType {
  list: CardListItemDataType[];
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
  };
  reducers: {
    queryList: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'listProjectList',

  state: {
    list: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryProjectList, payload);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response.data.list) ? response.data.list : [],
      });
      // console.log(state)
    },
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
  },
};

export default Model;
