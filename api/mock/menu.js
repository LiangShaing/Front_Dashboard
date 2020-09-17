const Menu = [
  {
    title: '首頁編輯',
    group: 'apps',
    icon: 'home',
    href: '/audit/home/home'
  },
  {
    title: '官網頁面連結管理',
    group: 'apps',
    icon: 'link',
    name: 'official-page',
    href: '/audit/home/officialPage'
  },
  {
    title: '使用者管理',
    group: 'apps',
    icon: 'account_box',
    name: 'system-manager',
    href: '',
    items: [
      {
        title: '使用者管理',
        group: 'apps',
        icon: 'insert_chart_outlined',
        name: 'user-manage',
        href: '/audit/account/userManage'
      },
      {
        title: '功能授權管理',
        group: 'apps',
        icon: 'mdi-magnify',
        name: 'user-auth',
        href: '/audit/account/userAuth'
      },
      {
        title: '部門維護',
        group: 'apps',
        icon: 'mdi-magnify',
        name: 'user-auth',
        href: '/audit/account/department'
      }
    ]
  },
  {
    title: '頁尾',
    group: 'apps',
    icon: 'list_alt',
    name: 'footer',
    href: '',
    items: [
      {
        title: '客戶權益須知',
        group: 'apps',
        icon: '',
        name: 'footer-customerRights',
        href: '/audit/footer/customerRights'
      },
      {
        title: '金融友善專區',
        group: 'apps',
        icon: '',
        name: 'footer-friendly',
        href: '/audit/footer/friendly'
      }

    ]
  },
  {
    title: '異動記錄查詢',
    group: 'apps',
    icon: 'search',
    href: '/audit/other/exportAlter'
  },
];

export default Menu;
