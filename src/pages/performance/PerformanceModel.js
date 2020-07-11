import modelExtend from 'dva-model-extend';
import $model from '@/utils/handleModel';
import { utilModel } from '@/models/common';
import { queryPerformanceList } from './service';

const namespace = 'performance_list';

const initState = {
  filter: {},
  list: [],
};

const { model, actionCreators: actions } = $model(
  modelExtend(utilModel, {
    namespace,
    state: initState,
    effects: {
      *queryList(_, { call, put, select }) {
        const { filter, pagination } = yield select(state => state[namespace]);
        const { current, pageSize } = pagination;

        const response = yield call(queryPerformanceList, {
          ...filter,
          pagination: { current, pageSize },
        });

        yield put({
          type: 'updateState',
          payload: {
            list: response.data.list,
            pagination: response.pagination,
          },
        });
      },
    },
  })
);

export { namespace, actions };

export default model;
