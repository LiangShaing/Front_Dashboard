export const caseEnum = {
    d: 'D',//草稿 column: status
    e: 'E',//經辦 column: status
    r: 'R',//大經辦 column: status
    a: 'A',//審核 column: status
    p: 'P',//已上架 column: status
    n: 'N',//未刪除 column: isDelete
    y: 'Y',//刪除 column: isDelete
    main: '1',//主約 column: isMain,
    attach: '0',//附約 column: isMain,
    docReview_n: 'N',//不須文審 column: docReview
    docReview_y: 'Y'//須文審 column: docReview

}

export const currentCaseStatusEnum = (status, isDelete) => {

    const caseStatus = {
        [caseEnum.d + caseEnum.n]: '草稿',
        [caseEnum.r + caseEnum.n]: '待審核',
        [caseEnum.a + caseEnum.n]: '待覆核',
        [caseEnum.p + caseEnum.n]: '已上架',
        [caseEnum.r + caseEnum.y]: '刪除審核',
        [caseEnum.a + caseEnum.y]: '刪除覆核',
        [caseEnum.p + caseEnum.y]: '已下架'
    }
    return caseStatus[status.toUpperCase() + isDelete.toUpperCase()];
}

export const centreEnum = [
    { uid: "activity", title: "最新活動" },
    { uid: "decree", title: "政令新聞" }
]


export const editionEnum = [
    { value: 'single', text: '單一PDF' },
    { value: 'multiple', text: '多個PDF' },
    { value: 'edit', text: '純文案' },
    { value: 'years', text: '篩選' }
]

export const customerReservedCaseEnum = [
    { text: "處理中", value: "P" },
    { text: "已結案", value: "A" },
    { text: "取消", value: "C" }
]

export const customerFeedbackCaseEnum = [
    { text: "未處理", value: "U" },
    { text: "已結案", value: "A" }
]

export const loanServiceEnum = {
    p: 'P',//給付方式
    r: 'R',//還款方式
    m: 'M'//房貸諮詢

}

export const officialPageLinkAreaEnum = {
    m: 'M',// header
    c: 'C',//總公司
    s: 'S',//連結設定
    g: 'G',//集團成員
    u: 'U'//社群連結
}

export const officialPageHeaderLinkEnum = {
    b: 'B',//保險商品
    u: 'U'//其他
}

export const hospitalItemEnum = [{
    uid: 'A',
    name: '一般體檢'
},
{
    uid: 'B',
    name: '靜止心電圖'
},
{
    uid: 'C',
    name: '胸部X光'
},
{
    uid: 'D',
    name: '生化檢驗'
},
{
    uid: 'E',
    name: '運動心電圖'
},
{
    uid: 'F',
    name: '肺功能'
},
{
    uid: 'G',
    name: '腹部超音波'
},
{
    uid: 'H',
    name: '心臟超音波'
},
{
    uid: 'I',
    name: '聽力(含純音聽力)'
},
{
    uid: 'J',
    name: '尿液尼古丁檢測'
}]


export const areaOptions = [
    '基隆市',
    '台北市',
    '新北市',
    '桃園縣市',
    '新竹縣市',
    '苗栗縣市',
    '台中市',
    '彰化縣市',
    '南投縣市',
    '雲林縣',
    '嘉義縣市',
    '台南市',
    '高雄市',
    '屏東縣市',
    '台東縣市',
    '花蓮縣市',
    '宜蘭縣市',
    '澎湖縣市',
    '金門縣'
]

export const catalogOptions = [
    { value: "A", text: '保單變更' },
    { value: "B", text: '繳費服務' },
    { value: "C", text: '借款服務' },
    { value: "D", text: '生存金/滿期金給付' },
    { value: "E", text: '理賠服務' },
    { value: "F", text: '查詢病歷同意書' },
    { value: "G", text: '保全作業' },
    { value: "H", text: '團體年金保險' },
    { value: "J", text: '新契約及續保文件' },
]


export default {
    caseEnum,
    centreEnum,
    editionEnum,
    customerReservedCaseEnum,
    customerFeedbackCaseEnum,
    currentCaseStatusEnum,
    loanServiceEnum,
    officialPageLinkAreaEnum,
    officialPageHeaderLinkEnum,
    hospitalItemEnum,
    areaOptions,
    catalogOptions
}