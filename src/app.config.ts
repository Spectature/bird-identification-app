export default defineAppConfig({
  pages: ['views/identify-img/select-img', 'views/today-img/today-img', 'views/bird-nest/bird-nest', 'layout/index/index'],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
  },
  subpackages: [
    {
      root: 'subcontract',
      pages: ['views/index/subcontract-index'],
    },
  ],
  tabBar: {
    color: '#000000',
    selectedColor: '#3cc51f',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'views/identify-img/select-img',
        text: '看图识鸟',
        iconPath: 'assets/icons/icon.png',
        selectedIconPath: 'assets/icons/icon-active.png',
      },
      {
        pagePath: 'views/today-img/today-img',
        text: '今日趣图',
        iconPath: 'assets/icons/icon.png',
        selectedIconPath: 'assets/icons/icon-active.png',
      },
      {
        pagePath: 'views/bird-nest/bird-nest',
        text: '鸟窝探秘',
        iconPath: 'assets/icons/icon.png',
        selectedIconPath: 'assets/icons/icon-active.png',
      },
    ],
  },
});
