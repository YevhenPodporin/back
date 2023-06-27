"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function storageUpload(file) {
    const name = file.name;
    const md5 = file.md5;
    // file.name = `${md5}_${name}`;
    file.mv(`${file.tempFilePath}`, function (err) {
        return err;
    });
}
exports.default = storageUpload;
