export const DEFAULT_START_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE_SIZE_OPTIONS = ['10', '30', '50', '100'];
export const DEFAULT_SHOW_QUICK_JUMPER = true;
export const DEFAULT_SHOW_SIZE_CHANGER = true;
export const DEFAULT_SHOW_TOTAL = total => `共 ${total} 条`;

export const DEFAULT_PAGINATION = {
  current: DEFAULT_START_PAGE,
  pageSize: DEFAULT_PAGE_SIZE,
  pageSizeOptions: DEFAULT_PAGE_SIZE_OPTIONS,
  showQuickJumper: DEFAULT_SHOW_QUICK_JUMPER,
  showSizeChanger: DEFAULT_SHOW_SIZE_CHANGER,
  showTotal: DEFAULT_SHOW_TOTAL,
};

export const CLIENT_PAGINATION = {
  pageSizeOptions: DEFAULT_PAGE_SIZE_OPTIONS,
  showQuickJumper: DEFAULT_SHOW_QUICK_JUMPER,
  showSizeChanger: DEFAULT_SHOW_SIZE_CHANGER,
  showTotal: DEFAULT_SHOW_TOTAL,
};
