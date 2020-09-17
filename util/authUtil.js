import { caseEnum } from "@/api/enum";

const combindAuthBtn = (auth, headers) => {
    //經辦
    if (auth.indexOf(caseEnum.e) !== -1) {
        headers.push({
            text: "刪除",
            value: "remove",
            align: "center",
            width: "8%",
            sortable: false
        });

    }

    // 大經辦
    if (auth.indexOf(caseEnum.r) !== -1) {
    }

    // 覆核者
    if (auth.indexOf(caseEnum.a) !== -1) {
    }

    headers.push({
        text: "編輯&檢閱",
        value: "edit",
        align: "center",
        width: "10%",
        sortable: false
    });
};

const combindAuthBtn_send = (auth, headers) => {
    //經辦
    if (auth.indexOf(caseEnum.e) !== -1) {
        headers.push({
            text: "送審",
            value: "send",
            align: "center",
            width: "8%",
            sortable: false
        });
        headers.push({
            text: "刪除",
            value: "remove",
            align: "center",
            width: "8%",
            sortable: false
        });

    }

    // 大經辦
    if (auth.indexOf(caseEnum.r) !== -1) {
        headers.push({
            text: "大經辦審核",
            value: "auditR",
            align: "center",
            width: "10%",
            sortable: false
        });
    }

    // 覆核者
    if (auth.indexOf(caseEnum.a) !== -1) {
        headers.push({
            text: "覆核者審核",
            value: "auditA",
            align: "center",
            width: "10%",
            sortable: false
        });

    }

    if (auth.indexOf(caseEnum.a) !== -1 || auth.indexOf(caseEnum.r) !== -1) {
        headers.push({
            text: "退回",
            value: "reject",
            align: "center",
            width: "10%",
            sortable: false
        });

    }
};

const combindAuthBtn_about_contract = (auth, headers) => {
    //經辦
    if (auth.indexOf(caseEnum.e) !== -1) {
        headers.push({
            text: "送審",
            value: "send",
            align: "center",
            width: "7%",
            sortable: false
        });
        headers.push({
            text: "刪除",
            value: "remove",
            align: "center",
            width: "7%",
            sortable: false
        });
    }

    // 大經辦
    if (auth.indexOf(caseEnum.r) !== -1) {
        headers.push({
            text: "大經辦審核",
            value: "auditR",
            align: "center",
            width: "10%",
            sortable: false
        });
    }

    // 覆核者
    if (auth.indexOf(caseEnum.a) !== -1) {
        headers.push({
            text: "覆核者審核",
            value: "auditA",
            align: "center",
            width: "10%",
            sortable: false
        });
    }

    headers.push({
        text: "項目編輯",
        value: "details",
        align: "center",
        width: "10%",
        sortable: false
    });
};

const combindAuthBtn_single = (auth, headers) => {
    //經辦
    if (auth.indexOf(caseEnum.e) !== -1) {
    }

    // 大經辦
    if (auth.indexOf(caseEnum.r) !== -1) {
    }

    // 覆核者
    if (auth.indexOf(caseEnum.a) !== -1) {
    }

    headers.push({
        text: "編輯",
        value: "edit",
        align: "center",
        width: "8%",
        sortable: false
    });
};



export default {
    combindAuthBtn,
    combindAuthBtn_send,
    combindAuthBtn_single,
    combindAuthBtn_about_contract,
};