import React, { PureComponent } from 'react';
import { Table, Spin } from 'antd';
import { connect } from 'dva';

import { namespace, actions } from './PerformanceModel';

@connect(
  state => ({
    data: state[namespace],
    loading: state.loading.effects[`${namespace}/queryList`],
  }),
  actions
)
class List extends PureComponent {
  getColumns = () => {
    const columns = [
      {
        title: '分销商名称ID',
        dataIndex: 'uuid',
        key: 'uuid',
      },
      {
        title: '分销商名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '经营状态',
        dataIndex: 'status',
        key: 'status',
      },
      {
        title: '注册时间',
        dataIndex: 'createTime',
        key: 'createTime',
      },
      {
        title: '操作',
        dataIndex: 'actions',
        key: 'actions',
        width: 200,
      },
    ];

    return columns;
  };

  handleTableChange = pagination => {
    const { updateState, queryList } = this.props;

    updateState({ pagination });
    queryList();
  };

  render() {
    const { data, loading = false } = this.props;
    console.log(data)
    // const { list, pagination } = data;

    return (
      <Spin spinning={loading}>
        <Table
          rowKey="uuid"
          dataSource={data}
          columns={this.getColumns()}
          pagination={pagination}
          onChange={this.handleTableChange}
        />
      </Spin>
    );
  }
}

export default List;
