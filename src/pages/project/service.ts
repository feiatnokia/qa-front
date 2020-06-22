import { post } from '@/utils/request';

const projectList = 'project/list'
export const queryProjectList = (params : string) => post(projectList, params);
