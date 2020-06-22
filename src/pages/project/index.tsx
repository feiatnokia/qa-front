import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, List, Typography } from 'antd';
import React, { Component } from 'react';

import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect, Dispatch } from 'umi';
import { StateType } from './model';
import { CardListItemDataType } from './data.d';
import styles from './style.less';

const { Paragraph } = Typography;

interface ListProjectListProps {
  listProjectList: StateType;
  dispatch: Dispatch;
  loading: boolean;
}
interface ListProjectListState {
  visible: boolean;
  done: boolean;
  current?: Partial<CardListItemDataType>;
}

class ListProjectList extends Component<ListProjectListProps, ListProjectListState> {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'listProjectList/fetch',
      payload: {
        total: '100',
        pageSize: '20',
        current: '1',
      },
    });
  }

  render() {
    const {
      listProjectList: { list },
      loading,
    } = this.props;
    console.log(this.props.listProjectList)
    const extraContent = (
      <div className={styles.extraImg}>
        <img
          alt="标题pic"
          src="https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png"
        />
      </div>
    );
    const nullData: Partial<CardListItemDataType> = {};
    return (
      <PageHeaderWrapper extraContent={extraContent}>
        <div className={styles.cardList}>
          <List<Partial<CardListItemDataType>>
            rowKey="id"
            loading={loading}
            grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
            dataSource={[nullData, ...list]}
            renderItem={(item) => {
              if (item && item.id) {
                return (
                  <List.Item key={item.id}>
                    <Card
                      hoverable
                      className={styles.card}
                      actions={[<a key="option1">编辑</a>, <a key="option2">查看</a>]}
                    >
                      <Card.Meta
                        avatar={<img alt="" className={styles.cardAvatar} src={item.avatar} />}
                        title={<a>{item.projectName}</a>}
                        description={
                          <Paragraph className={styles.item} ellipsis={{ rows: 3 }}>
                            {item.projectNo}
                          </Paragraph>
                        }
                      />
                    </Card>
                  </List.Item>
                );
              }
              return (
                <List.Item>
                  <Button type="dashed" className={styles.newButton}>
                    <PlusOutlined /> 新增产品
                  </Button>
                </List.Item>
              );
            }}
          />
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default connect(
  ({
    listProjectList,
    loading,
  }: {
    listProjectList: StateType;
    loading: {
      models: { [key: string]: boolean };
    };
  }) => ({
    listProjectList,
    loading: loading.models.listProjectList,
  }),
)(ListProjectList);
