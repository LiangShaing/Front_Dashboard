
const kebab = (str) => {
  return (str || '').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
};

const isEmpty = (data) => {
  if (data === null || data === undefined || Object.keys(data).length === 0 || data === "") {
    return true
  } else {
    return false
  }
}

const isBlank = (data) => {
  if (data === null || data === undefined || data === "") {
    return true
  } else {
    return false
  }
}
const fileType = (data) => {
  if (data === null || data === undefined || data === "") {
    return 'upload'
  } else {
    return 'stock'
  }
}

const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});

const checkFileType = (type, file) => {
  if (type.includes(file.type)) {
    return true
  } else {
    return false
  }
}

const checkIsFile = (file) => {
  if (file.name !== undefined && file.type !== undefined && file.size !== undefined) {
    return true
  } else {
    return false
  }
}

const handleUpload = async (value, checkType) => {
  let obj = {
    fileName: "",
    contents: ""
  }

  if (value === undefined || (typeof value === 'object' && value.length === 0)) {
    return obj
  }

  const bln = checkIsFile(value);
  const bln2 = checkFileType(checkType, value);
  //不是檔案
  if (!bln || !bln2) {
    throw false;
  }

  let file = await toBase64(value);
  obj.fileName = value.name;
  obj.contents = file;
  return obj;

}

const handleStock = async (value, checkType) => {
  let obj = {
    fileName: "",
    contents: ""
  }

  if (isEmpty(value) || value.trim() === "") {
    return obj
  }

  const suffixIndex = value.lastIndexOf(".");
  const suffix = value.substring(suffixIndex + 1).toLowerCase();
  if (!checkType.includes(suffix)) {
    throw false
  }

  obj.fileName = value;
  return obj

}

const imageProcess = async (checkFile, data, typeParam, fileParam, stockParam) => {
  let resource = null
  try {
    if (data.fileInput[typeParam] === "upload") {
      resource = await handleUpload(data.fileInput[fileParam], process.env.IMAGE_TYPE)
      if (resource.fileName !== "") {
        checkFile.push(resource.fileName);
      }
    } else {
      resource = await handleStock(data.fileInput[stockParam], process.env.IMAGE_TYPE)
    }
    if (resource.fileName === "") {
      throw false;
    }
    return resource
  } catch (e) {
    return e
  }

}

const imageCheck = async (checkFile, data, typeParam, fileParam, stockParam) => {
  let resource = null
  try {
    if (data.fileInput[typeParam] === "upload") {
      resource = await handleUpload(data.fileInput[fileParam], process.env.IMAGE_TYPE)
      if (resource.fileName !== "") {
        checkFile.push(resource.fileName);
      }
    } else {
      resource = await handleStock(data.fileInput[stockParam], process.env.IMAGE_TYPE)
    }
    return resource
  } catch (e) {
    return e
  }
}

const reservationImageCheck = async (checkFile, data, typeParam, fileParam, stockParam, stockItems) => {
  let uid = "";
  let fileName = "";
  let contents = "";
  //upload
  if (data.fileInput[typeParam] === "upload") {
    //為空
    if (data.fileInput[fileParam] === undefined || (typeof data.fileInput[fileParam] === 'object' && data.fileInput[fileParam].length === 0)) {
      return {
        fileName: fileName,
        contents: contents
      }
    }

    const bln = checkIsFile(data.fileInput[fileParam]);
    const bln2 = checkFileType(process.env.IMAGE_TYPE, data.fileInput[fileParam]);
    //不是檔案
    if (!bln || !bln2) {
      return false;
    }

    checkFile.push(data.fileInput[fileParam].name);
    let file = await toBase64(data.fileInput[fileParam]);
    fileName = data.fileInput[fileParam].name;
    contents = file;
  } else {//stock
    if (isEmpty(data.fileInput[stockParam]) || data.fileInput[stockParam].trim() === "") {
      return {
        fileName: fileName,
        contents: contents
      }
    }

    const arr = stockItems.filter(ele => ele.value === data.fileInput[stockParam]);


    if (arr.length === 0) {
      return false;
    }
    const name = arr[0].text
    const suffixIndex = name.lastIndexOf(".");
    const suffix = name.substring(suffixIndex + 1).toLowerCase();
    if (!process.env.IMAGE_TYPE.includes(suffix)) {
      return false;
    }

    uid = data.fileInput[stockParam];

    for (const ele of stockItems) {
      if (ele.value === data.fileInput[stockParam]) {
        fileName = ele.text;
      }
    }
  }
  return {
    uid: uid,
    fileName: fileName,
    contents: contents
  }
}

const pdfProcess = async (checkFile, data, typeParam, fileParam, stockParam) => {
  let resource = null
  try {
    if (data.fileInput[typeParam] === "upload") {
      resource = await handleUpload(data.fileInput[fileParam], process.env.PDF_TYPE)
      if (resource.fileName !== "") {
        checkFile.push(resource.fileName);
      }
    } else {
      resource = await handleStock(data.fileInput[stockParam], process.env.PDF_TYPE)
    }
    if (resource.fileName === "") {
      throw false;
    }
    return resource
  } catch (e) {
    return e
  }

}

const pdfCheck = async (checkFile, data, typeParam, fileParam, stockParam) => {
  let resource = null
  try {
    if (data.fileInput[typeParam] === "upload") {
      resource = await handleUpload(data.fileInput[fileParam], process.env.PDF_TYPE)
      if (resource.fileName !== "") {
        checkFile.push(resource.fileName);
      }
    } else {
      resource = await handleStock(data.fileInput[stockParam], process.env.PDF_TYPE)
    }
    return resource
  } catch (e) {
    return e
  }

}

const formPdfProcess = async (checkFile, data, typeParam, fileParam, stockParam, stockItems) => {
  let uid = "";
  let fileName = "";
  let contents = "";
  if (data.fileInput[typeParam] === "upload") {
    //為空
    if (data.fileInput[fileParam] === undefined || (typeof data.fileInput[fileParam] === 'object' && data.fileInput[fileParam].length === 0)) {
      return {
        fileName: fileName,
        contents: contents
      }
    }

    const bln = checkIsFile(data.fileInput[fileParam]);
    const bln2 = checkFileType(process.env.PDF_TYPE, data.fileInput[fileParam]);

    //不是檔案
    if (!bln || !bln2) {
      return false;
    }

    checkFile.push(data.fileInput[fileParam].name);
    let file = await toBase64(data.fileInput[fileParam]);
    fileName = data.fileInput[fileParam].name;
    contents = file
  } else {

    const arr = stockItems.filter(ele => ele.value === data.fileInput[stockParam]);

    if (arr.length === 0) {
      return false;
    }
    const name = arr[0].text
    const suffixIndex = name.lastIndexOf(".");
    const suffix = name.substring(suffixIndex + 1).toLowerCase();
    if (!process.env.PDF_TYPE.includes(suffix)) {
      return false;
    }


    uid = data.fileInput[stockParam];

    for (const ele of stockItems) {
      if (ele.value === data.fileInput[stockParam]) {
        fileName = ele.text;
      }
    }
  }
  return {
    uid: uid,
    fileName: fileName,
    contents: contents
  }
}

const fileProcess = async (checkFile, data, typeParam, fileParam, stockParam) => {

  let fileName = "";
  let contents = "";
  if (data.fileInput[typeParam] === "upload") {
    if (data.fileInput[fileParam] === undefined) {
      return false;
    }
    const bln = checkIsFile(data.fileInput[fileParam]);

    if (!bln) {
      return false;
    }
    checkFile.push(data.fileInput[fileParam].name);
    let file = await toBase64(data.fileInput[fileParam]);
    fileName = data.fileInput[fileParam].name;
    contents = file
  } else {

    const bln = isEmpty(data.fileInput[stockParam])
    if (bln) {
      return false;
    }
    fileName = data.fileInput[stockParam];
  }
  return {
    fileName: fileName,
    contents: contents
  }
}

const fileCheck = async (checkFile, data, typeParam, fileParam, stockParam) => {

  let fileName = "";
  let contents = "";
  if (data.fileInput[typeParam] === "upload") {

    //為空
    if (data.fileInput[fileParam] === undefined || (typeof data.fileInput[fileParam] === 'object' && data.fileInput[fileParam].length === 0)) {
      return {
        fileName: fileName,
        contents: contents
      }
    }

    const bln = checkIsFile(data.fileInput[fileParam]);

    if (!bln) {
      return false;
    }
    checkFile.push(data.fileInput[fileParam].name);
    let file = await toBase64(data.fileInput[fileParam]);
    fileName = data.fileInput[fileParam].name;
    contents = file;
  } else {

    const bln = isEmpty(data.fileInput[stockParam])
    if (bln) {
      return {
        fileName: fileName,
        contents: contents
      };
    }
    fileName = data.fileInput[stockParam];
  }
  return {
    fileName: fileName,
    contents: contents
  }
}

const reservationFileCheck = async (checkFile, data, typeParam, fileParam, stockParam, stockItems) => {
  let uid = "";
  let fileName = "";
  let contents = "";
  if (data.fileInput[typeParam] === "upload") {

    //為空
    if (data.fileInput[fileParam] === undefined || (typeof data.fileInput[fileParam] === 'object' && data.fileInput[fileParam].length === 0)) {
      return {
        fileName: fileName,
        contents: contents
      }
    }

    const bln = checkIsFile(data.fileInput[fileParam]);

    if (!bln) {
      return false;
    }
    checkFile.push(data.fileInput[fileParam].name);
    let file = await toBase64(data.fileInput[fileParam]);
    fileName = data.fileInput[fileParam].name;
    contents = file;
  } else {

    const bln = isEmpty(data.fileInput[stockParam])
    if (bln) {
      return {
        fileName: fileName,
        contents: contents
      };
    }
    uid = data.fileInput[stockParam];
    for (const ele of stockItems) {
      if (ele.value === data.fileInput[stockParam]) {
        fileName = ele.text;
      }
    }

  }
  return {
    uid: uid,
    fileName: fileName,
    contents: contents
  }
}

const checkSelectFileType = (stockItems, uid, type) => {
  const arr = stockItems.filter(ele => ele.value === uid);
  if (arr.length === 0) {
    return false;
  } else {
    const name = arr[0].text
    const suffixIndex = name.lastIndexOf(".");
    const suffix = name.substring(suffixIndex + 1).toLowerCase();
    if (!type.includes(suffix)) {
      return false;
    } else {
      return true
    }
  }

}

export default {
  kebab,
  toBase64,
  isEmpty,
  isBlank,
  fileType,
  checkFileType,//檢查檔案型態
  checkIsFile,//檢查是否為檔案
  imageProcess,//判斷檔案型態錯誤空值 回傳false
  pdfProcess,//判斷檔案型態錯誤空值 回傳false
  fileProcess,//判斷檔案型態錯誤空值 回傳false
  imageCheck,//判斷檔案型態錯誤 回傳false  空值回傳 fileName="" contents=""
  reservationImageCheck,//判斷檔案型態錯誤 回傳false  空值回傳 fileName="" contents=""
  pdfCheck,//判斷檔案型態錯誤 回傳false  空值回傳 fileName="" contents=""
  fileCheck,//判斷檔案型態錯誤 回傳false  空值回傳 fileName="" contents=""
  reservationFileCheck,//判斷檔案型態錯誤 回傳false  空值回傳 uid="" fileName="" contents=""
  checkSelectFileType,//判斷選擇檔案型態錯誤 回傳false  
  formPdfProcess
};