const formatDateFun = (fmt, date) => {
    var o = {
        "M+": date.getMonth() + 1, //月份 
        "d+": date.getDate(), //日 
        "h+": date.getHours(), //小时 
        "m+": date.getMinutes(), //分 
        "s+": date.getSeconds(), //秒 
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
        "S": date.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

const formatDate = (date) => {
    if (!date) return null

    let [year, month, day] = date.split('-')
    year = year - 1911;
    return `${year}/${month}/${day}`
};

const parseDate = (date) => {
    if (!date) return null

    let [month, day, year] = date.split('/')
    year = year + 1911;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
};

const formatDate2 = (date) => {
    if (!date) return null

    let [year, month, day] = date.split('-')
    year = Number(year);
    return `${year}${month}${day}`
};

const formatDateWithTime = (val) => {
    if (!val) return null

    let [date, time] = val.split(' ')
    if (time === null || time === undefined) {
        return date + " 00:00:00"
    } else {
        return val
    }
};

const parseDate2 = (date) => {
    if (!date) return null

    let year = date.substring(0, 4)
    let month = date.substring(4, 6)
    let day = date.substring(6, 8)

    return `${year}-${month}-${day}`
};

const combinationDate = (obj, data) => {

    if (obj === null) return null
    if (data.onTime !== null) {
        obj.startDate = data.onTime.split(" ")[0];
        obj.startHour = data.onTime.split(" ")[1].split(":")[0];
        obj.startMin = data.onTime.split(" ")[1].split(":")[1];

    } else {
        obj.startDate = null;
        obj.startHour = "00";
        obj.startMin = "00";
    }
    if (data.offTime !== null) {
        obj.endDate = data.offTime.split(" ")[0];
        obj.endHour = data.offTime.split(" ")[1].split(":")[0];
        obj.endMin = data.offTime.split(" ")[1].split(":")[1];

    } else {
        obj.endDate = null;
        obj.endHour = "00";
        obj.endMin = "00";
    }

};

const splitDate = (value) => {
    let obj = {
        date: "",
        hour: "",
        min: "",
        second: ""
    }
    if (value === null) return null
    let [date, time] = value.split(' ');

    if (date !== null && date !== undefined && date !== "") {
        obj.date = date

    }

    if (time !== null && time !== undefined && time !== "") {
        let [hour, min, second] = time.split(":");
        obj.hour = hour
        obj.min = min
        obj.second = second
    }
    return obj
};

const mergerDate = (value) => {
    const nhour = Number(value.hour);
    const nmin = Number(value.min);
    const nsecond = Number(value.second);
    value.hour = value.hour === "" ? '00' : nhour < 10 ? ("0" + nhour) : value.hour
    value.min = value.min === "" ? '00' : nmin < 10 ? ("0" + nmin) : value.min
    value.second = value.second === "" ? '00' : nsecond < 10 ? ("0" + nsecond) : value.second
    return `${value.date} ${value.hour}:${value.min}:${value.second}`
};

const mergerTimeArea= (value) => {
    const nhour = Number(value.hour);
    const nmin = Number(value.min);
    const nsecond = Number(value.second);
    const ntohour = Number(value.toHour);
    const ntomin = Number(value.toMin);
    const ntosecond = Number(value.toSecond);
    value.hour = value.hour === "" ? '00' : nhour < 10 ? ("0" + nhour) : value.hour
    value.min = value.min === "" ? '00' : nmin < 10 ? ("0" + nmin) : value.min
    value.second = value.second === "" ? '00' : nsecond < 10 ? ("0" + nsecond) : value.second
    value.toHour = value.toHour === "" ? '00' : ntohour < 10 ? ("0" + ntohour) : value.toHour
    value.toMin = value.toMin === "" ? '00' : ntomin < 10 ? ("0" + ntomin) : value.toMin
    value.toSecond = value.toSecond === "" ? '00' : ntosecond < 10 ? ("0" + ntosecond) : value.toSecond
    return `${value.hour}:${value.min}-${value.toHour}:${value.toMin}`
};

const checkDateTime = (value) => {
    if (value === null) return null
    let [date, time] = value.split(' ');

    if (time !== null && time !== undefined && time !== "") {
        let [hour, min, second] = time.split(":");
        const nhour = Number(hour);
        const nmin = Number(min);
        const nsecond = Number(second);
        if (nhour < 10) {
            hour = "0" + hour
        }

        if (nmin < 10) {
            min = "0" + min
        }

        if (nsecond < 10) {
            second = "0" + second
        }
    }
    return `${date} ${hour}:${min}:${second}`
};



export default {
    formatDate,
    parseDate,
    formatDate2,
    formatDateFun,
    parseDate2,
    combinationDate,
    formatDateWithTime,
    splitDate,
    checkDateTime,
    mergerDate,
    mergerTimeArea
};