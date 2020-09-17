
const URI = {
    login: '/login',
    // login: '/oauth/token',
    menu_user: '/menu/user',
    principal: '/principal',
    api_dept: '/dept',
    api_user: '/user',
    api_userSuspend: '/user/writeoff',
    role: '/role',
    api_privilegeUser: '/privilege/user',
    api_privilege: '/privilege',
    api_privilegeRole: '/privilege/role',
    api_agentPrivilege: '/agent/privilege',
    api_agent: '/agent',
    api_menu_user: '/menu/user',

    // 匯出角色權限報表
    api_excel_role: '/excel/role',
    // 匯出人員角色報表
    api_excel_user: '/excel/user',

    // 幣別
    // api_currency_rest: '/currency-rest',
    api_currency_rest: '/currency-temp-rest/search/findAllByIsDelete', //20200904改用

    //檔案庫
    api_resources: '/resources',
    //ckeditor上傳檔案
    api_upload_resources: '/upload/resource',
    //ckeditor取檔案
    api_resource_image: '/resource/image',
    api_resource_pdf: '/resource/pdf',
    // 查詢檔案
    api_resources_temp_rest: '/resources-temp-rest',
    // 查詢檔案-預約
    api_reservation_resources_temp_rest_findByQuery: '/reservation-resources-temp/findByQuery',
    // 查詢檔案-表單索引
    api_form_resources_temp_findByQuery: '/form-resources-temp/findByQuery',
    // 20200528查詢檔案修改(減少sql)
    api_resources_temp: '/resource-temp',
    // 查詢檔案是否存在
    api_resources_temp_rest_findByFileNameIn: '/resources-temp-rest/search/findByFileNameIn',
    api_reservation_resources_temp: '/reservation-resources-temp',
    api_form_resources_temp: '/form-resources-temp',

    // 特色專區
    api_featureTemp_rest: '/feature-temp-rest',
    api_featureTempSearch: '/featureTemp/search/findByUid',
    api_feature_temp_rest_findAllByCmDeptId: '/feature-temp-rest/search/findAllByCmDeptId',
    api_feature: '/feature',
    api_feature_temp_rest_getMaxSort: '/feature-temp-rest/search/getMaxSort',

    // 商品總覽
    api_findByBigCoverageUidAndCmDeptId_rest: '/contract-temp-rest/search/findByBigCoverageUidAndCmDeptId',
    api_contract: '/contract',
    api_bigCoverage_rest: '/bigcoverage-rest',
    api_contract_temp_rest_getMaxSort: '/contract-temp-rest/search/getMaxSort',
    // api_contract_term_rest_findByIsDelete: '/contract-term-rest/search/findByIsDelete',//給付說明
    api_contract_tags_rest_findByIsDelete: '/contract-tags-temp-rest/search/findByIsDelete',//tag

    // 標的動態
    api_invest_market_info_temp_rest: '/investmarketinfo-temp-rest',
    api_invest_market_info_temp_rest_with_date: '/investmarketinfo-temp-rest/search/findByBeginDateGreaterThanEqualAndEndDateLessThanEqual',
    api_invest_market_info_temp_rest_with_startDate: '/investmarketinfo-temp-rest/search/findByBeginDateGreaterThanEqual',
    api_invest_market_info_temp_rest_with_endDate: '/investmarketinfo-temp-rest/search/findByEndDateLessThanEqual',
    api_invest_market_info: '/investmarketinfo',

    // 利率
    api_rate_resources_temp_rest: '/rateresources-temp-rest',//
    api_rateresources_temp: '/rateresources-temp',



    // 建議搭配主附約
    api_contract_temp_rest_findByIsMainIn: '/contract-temp-rest/search/findByIsMainIn',
    api_contract_temp_rest_findByIsMain: '/contract-temp-rest/search/findByIsMain',
    api_contract_relation_mainRelationQuery: '/contractrelation/mainRelationQuery',//
    api_contract_relation_temp_rest: '/contractrelation-temp-rest',
    api_contract_relation_temp_rest_findByMainContractUid: '/contractrelation-temp-rest/search/findByMainContractUid',
    api_contract_relation_temp_rest_findByAttachContractUid: '/contractrelation-temp-rest/search/findByAttachContractUid',
    api_contract_relation_temp_rest_findByMainContractUidAndAttachContractUid: '/contractrelation-temp-rest/search/findByMainContractUidAndAttachContractUid',
    api_contract_relation: '/contractrelation',

    // 審閱期專區
    api_reviewperiod_temp_rest: '/reviewperiod-temp-rest',
    api_reviewperiod: '/reviewperiod',
    api_reviewperiod_temp_rest_getMaxSort: '/reviewperiod-temp-rest/search/getMaxSort',

    // 最新消息
    api_news_centre_temp_rest: '/news-centre-temp-rest/',
    api_news_centre: '/news-centre',
    api_news_centre_temp_rest_findByNewsCategoryIn: '/news-centre-temp-rest/search/findByNewsCategoryIn',//無使用

    // 元大情報
    api_news_tags_rest_findByCmDeptListLike: '/news-tags-rest/search/findByCmDeptListLike',
    api_news_tags_temp_rest_findByTagsUid: '/news-tags-data-temp-rest/search/findByTagsUid',

    // 營業據點
    api_location_temp_rest: '/location-temp-rest',
    api_location_info: '/locationinfo',
    api_location_rest: '/location-rest',
    api_divisionbase: '/divisionbase',
    api_divisionbase_temp_rest_findByRegionUidIn: '/divisionbase-temp-rest/search/findByRegionUidIn',
    api_location: '/location',


    //公益活動
    api_charity_info: '/charity/info',
    api_charity_info_temp_rest: '/charity-info-temp-rest',
    api_charity_temp_rest: '/charity-temp-rest',
    api_charity: '/charity',

    //資訊公開
    api_companyinfo_temp_rest_findAllByOrderBySortAsc: '/companyinfo-temp-rest/search/findAllByOrderBySortAsc',
    api_companyinfo: '/companyinfo',
    api_companyinfo_temp_rest_findByCategoryUidOrderBySort: '/companyinfoitem-temp-rest/search/findByCategoryUidOrderBySort',
    api_companyinfo_temp_rest_getMaxSortByCategoryUid: '/companyinfoitem-temp-rest/search/getMaxSortByCategoryUid',
    api_companyinfoitem: '/companyinfoitem',
    api_companyinfoitempdfgroup_temp_rest: '/companyinfoitempdfgroup-temp-rest/',
    api_companyinfoitempdfgroup: '/companyinfoitempdfgroup',
    api_contract_clause: '/contract-clause',

    //公司文化 
    api_ideal_info_temp_rest: '/ideal-info-temp-rest',
    api_ideal_info: '/ideal/info',
    api_ideal_temp_rest: '/ideal-temp-rest',
    api_ideal: '/ideal',

    //線上預約櫃台
    api_reservation: '/reservation',
    //線上預約櫃台-案件
    api_reservation_search: '/reservation/search',
    api_reservation_update: '/reservation/update',
    //線上預約櫃台-預約選項
    api_reservation_rest: '/reservation-rest',

    //光榮時刻
    api_glory_temp_rest: '/glory-temp-rest',
    api_glory: '/glory',

    //開放職缺
    api_vacancy_job_temp_rest: '/vacancy-job-temp-rest',
    api_vacancy_job: '/vacancy-job',
    api_about_join_job_temp_rest: '/about-join-job-temp-rest',
    api_about_join_job: '/about-join-job',

    // 員工關懷
    api_care_temp_rest: '/join-care-temp-rest',
    api_care: '/join-care',
    api_care_temp_rest_findByCareUidIn: '/join-care-item-temp-rest/search/findByCareUidIn',
    api_care_item: '/join-care/item',

    //服務總覽
    api_service: '/service',

    // 公司職場
    api_company_train_temp_rest: '/company-train-temp-rest',
    api_company_train: '/company-train',

    //保單變更
    api_change_info_temp_rest: '/policy-change-info-temp-rest',
    api_change_info: '/policy-change-info',
    api_change_info_item_temp_rest_findByPolicyChangeInfoUid: '/policy-change-info-item-temp-rest/search/findByPolicyChangeInfoUid',
    api_change_info_item: '/policy-change-info/item',

    //繳費服務說明
    api_paymentservice: '/paymentservice',

    //年度繳費證明
    api_payment_info_temp_rest_findByEdition: '/payment-info-temp-rest/search/findByEdition',
    api_paymentinfo: '/paymentinfo',

    //申請資格/應備文件
    api_loan_app_info: '/loan-app-info',
    api_loan_app_info_item_temp_rest: '/loan-app-info-item-temp-rest',
    api_loan_app_info_item: '/loan-app-info/item',

    // 意見信箱
    api_about_feedback: '/about-feedback',
    api_feedback_search: '/feedback/search',
    api_feedback_temp_rest_search_findAllByIsDelete: '/feedback-temp-rest/search/findAllByIsDelete',
    api_feedback_update: '/feedback/update',

    // 客戶權益須知
    api_about_right_tags_rest_findByCmDeptListLike: '/about-right-tags-rest/search/findByCmDeptListLike',
    api_about_right: '/about-right',

    // 金融友善專區
    api_about_friendly: '/about-friendly',

    // 借款服務-保單借款利率
    api_loan_rate_info: '/loan-rate-info',

    // 借款服務-給付方式/還款方式
    api_loan_info_repayment: '/loan-info-repayment',

    // 借款服務-房貸諮詢
    api_loan_info_mortgage: '/loan-info-mortgage',

    // 官網頁面連結管理
    api_page_info: '/page-info',

    // 幣別維護
    api_currency: '/currency',

    // 險別維護
    api_bigcoverage: '/bigcoverage',

    //海內外急難救助
    api_emergency_assistance_temp_rest: '/emergency-assistance-temp-rest',
    api_emergency_assistance: '/emergency-assistance',

    // 英文投保證明
    api_insurance_info_temp_rest: '/insurance-info-temp-rest',
    api_insurance_info: '/insurance-info',

    // 全球尊榮卡
    api_global_vip_info: '/global-vip-info',

    // 體檢醫療院所
    api_health_check_hospital_info_temp_rest: '/health-check-hospital-info-temp-rest',
    api_health_check_hospital_info: '/health-check-hospital/info',
    api_health_check_hospital_temp_rest: '/health-check-hospital-temp-rest',
    api_health_check_hospital: '/health-check-hospital',

    // 理賠服務
    api_about_claim_info_temp_rest: '/about-claim-info-temp-rest',
    api_about_claim_info: '/about-claim-info',

    // 保戶加值
    api_policyholder_bonus_info_temp_rest: '/policyholder-bonus-info-temp-rest',
    api_policyholder_bonus_info: '/policyholder-bonus-info',

    // 生存金/滿期金給付
    api_survivor_insurance_info_temp_rest: '/survivor-insurance-info-temp-rest',
    api_survivor_insurance_info: '/survivor-insurance-info',

    // 表單索引
    // api_form_index_info: '/form-index-info',
    api_form_index_info_item_temp_rest_findByFormIndexInfoUid: '/form-index-info-item-temp-rest/search/findByFormIndexInfoUid',
    api_form_index_info_item_temp_rest: '/form-index-info-item-temp-rest',
    api_form_index_info: '/form-index-info',
    api_form_index_info_item_temp_rest_findByFormIndexInfoItemUid: '/form-index-info-item-pdf-temp-rest/search/findByFormIndexInfoItemUid',
    api_form_index_info_pdf: '/form-index-info/pdf',

    // 異動紀錄
    api_cm_alter_log_export: '/cm-alter-log/export',

    // 首圖維護
    api_banner_all: '/banner/all',
    api_banner_pageId: '/banner/pageId',
    api_banner: '/banner',


    // 二皆
    // 商品分類
    api_contract_tags_temp_rest: '/contract-tags-temp-rest',
    api_contract_tags: '/contract-tags',

    // 部落格
    api_article_tags_temp_rest: '/article-tags-temp-rest',
    api_article_tags: '/article-tags',
    api_article: '/article',

    // 保戶刊物
    api_about_periodical_temp_rest: '/about-periodical-temp-rest',
    api_about_period: '/about-period',

    // 電話行銷案件
    api_telemarketer_search: '/telemarketer/search',
    api_telemarketer_update: '/telemarketer/update',

    // 壽險顧問案件
    api_consultant_search: '/consultant/search',
    api_consultant_update: '/consultant/update',

    // 險別頁面
    api_bigcoverage_detail_all: '/bigcoveragedetail/all',
    api_bigcoverage_detail_coverage: '/bigcoveragedetail/coverage',
    api_bigcoverage_detail: '/bigcoveragedetail',

    // 保險文章
    api_article_temp_rest: '/article-temp-rest',
    api_tags_rest_findByIsDelete: '/article-tags-rest/search/findByIsDelete',//文章分類
    api_contract_rest_findAllContractTemp: '/contract-temp-rest/search/findAllContractTemp',//全部商品
    api_article_rest_getMaxSort: '/article-temp-rest/search/getMaxSort',

    // 給付說明維護
    api_contract_term_temp_rest_findByIsDelete: '/contract-term-temp-rest/search/findByIsDelete',
    api_contract_term: '/contract-term',

    // 聯絡業務員-案件查詢
    api_contactus_search:"/contactus/search",
    api_contactus_update:"/contactus/update",

    // 保險知識
    api_contract_knowledge_temp_rest:'/contract-knowledge-temp-rest',
    api_contract_knowledge:'/contract-knowledge',

    // 商品廣告
    api_contract_asvertise_temp_rest:'/contract-advertise-temp-rest',
    api_contract_asvertise:'/contract-advertise',


}

export default URI;