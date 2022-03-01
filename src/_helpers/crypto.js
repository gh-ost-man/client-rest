import CryptoJS from "crypto-js";

const secret = "asdk;aslkd129038120@!@#$%^&*(";

const encryptData = (data) => {
    return CryptoJS.AES.encrypt(data.toString(), secret).toString();
}

const decryptData = (data) => {
    return CryptoJS.AES.decrypt(data, secret).toString(CryptoJS.enc.Utf8);
}

export {encryptData, decryptData};
