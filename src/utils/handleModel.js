/**
 * 生成外部引用的actionCreator
 * @param {String} namespace dva model命名空间
 * @param {Object} reducers dva reducers or effects
 * @param {Object} initActions
 * @return actionCreator
 */

const createrActions = (namespace, reducers, initActions = {}) =>
  Object.keys(reducers).reduce(
    (actions, name) => ({
      ...actions,
      [name]: (payload, meta, error) => ({
        type: `${namespace}/${name}`,
        payload,
        meta,
        error,
      }),
    }),
    initActions
  );

/**
 * @param {Object} model dva model
 * @return {Object} { namespace, model, actionCreators }
 */
export default model => {
  const { namespace, effects, reducers } = model;

  let actionCreators = createrActions(namespace, effects);
  actionCreators = createrActions(namespace, reducers, actionCreators);

  return { model, actionCreators, namespace };
};
