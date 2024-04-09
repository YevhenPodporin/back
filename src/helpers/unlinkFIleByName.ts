import * as fs from "fs";

const unlinkFileByName = (fileName: string): Promise<void> | void => {
    if (!fileName) return;
    return new Promise((resolve, reject) => {
        fs.unlink(process.cwd() + '/src/storage/files/' + fileName, (error) => {
            if (error) {
                reject(error.path);
            } else {
                resolve();
            }
        });
    });
};

export default unlinkFileByName;
