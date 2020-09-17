



const env = process.env.DEPLOY_ENV.toString().trim();

const baseURL = {
    local: process.env.LOCAL_PREVIEW_API,
    test: process.env.TEST_PREVIEW_API,
    dev: process.env.DEV_PREVIEW_API,
    sit: process.env.SIT_PREVIEW_API,
}

const URL = {
    // 商品
    product: baseURL[env] + '/products/overview',
    // 特色專區
    feature: baseURL[env] + '/products/features',
    // 利率
    rate: baseURL[env] + '/products/investment-center/rate',
    // 標的動態
    investment: baseURL[env] + '/products/investment-center/target',
    // 審閱期專區
    reviewStage: baseURL[env] + '/review-stage',
    // 資訊公開
    overview: baseURL[env] + '/about/overview',
    // 最新消息,元大情報
    recent: baseURL[env] + '/about/recent',
    // 元大品牌
    vision: baseURL[env] + '/about/vision',
    // 營業據點
    locations: baseURL[env] + '/about/locations',
    // 元大新聞
    news: baseURL[env] + '/about/recent/news',
    // 公益活動
    charity: baseURL[env] + '/about/charity',
    // 加入元大
    joinus: baseURL[env] + '/about/joinus',
    // 金融友善
    friendly: baseURL[env] + '/friendly',
    // 意見信箱
    emailus: baseURL[env] + '/our-services/emailus',
    // 線上預約櫃台
    reservation: baseURL[env] + '/our-services/reservation',
    // 客戶權益須知
    rights: baseURL[env] + '/rights',
    // 借款服務-申請資格/應備文件、保單借款利率、給付方式/還款方式、房貸諮詢
    insurancePolicy: baseURL[env] + '/our-services/insurance-policy/loan',
    // 保單變更
    policy: baseURL[env] + '/our-services/insurance-policy/update',
    // 理賠服務
    claim: baseURL[env] + '/our-services/claim',
    // 體檢醫療院所
    hospital: baseURL[env] + '/our-services/insurance-policy/hospital',
    // 生存金/滿期金給付
    maturity: baseURL[env] + '/our-services/insurance-policy/maturity',
    // 海外急難救助
    overseas: baseURL[env] + '/our-services/overseas-rescue',
    // 服務總覽
    ourServiceOverview: baseURL[env] + '/our-services/overview',
    // 繳費服務說明、年度繳費證明、繳費記錄
    payment: baseURL[env] + '/our-services/insurance-policy/payment',
    // 官網
    index: baseURL[env] + '',
    // 英文投保證明
    certification: baseURL[env] + '/our-services/insurance-policy/certification',
    // 全球個人尊榮服務卡、保戶加值服務
    valueAdd: baseURL[env] + '/our-services/insurance-policy/value-added',
    // 表單索引
    catalog: baseURL[env] + '/our-services/form/catalog',


}

export default URL;