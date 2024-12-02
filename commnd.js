const fs = require('fs');
const path = require('path');

// 找出所有的文件
function findFiles(dir, fileTypes) {
    let results = [];

    // 读取目录
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.lstatSync(filePath);

        if (stat.isDirectory()) {
            // 递归子目录
            results = results.concat(findFiles(filePath, fileTypes));
        } else {
            // 检查文件类型
            if (fileTypes.includes(path.extname(file))) {
                results.push(filePath);
            }
        }
    }

    return results;
}

// 转换文件名为驼峰命名
function toCamelCase(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+|_+|-+)/g, (match, index) => {
        if (+match === 0 || match === '-') return ''; // 去除数字开头和`-`符号
        return match.toUpperCase();
    });
}

// 创建枚举
function createEnum(filePaths, rootDir) {
    const enumObj = {};

    filePaths.forEach(filePath => {
        const relativePath = path.relative(rootDir, filePath);
        const fileName = path.basename(filePath, path.extname(filePath));
        const camelCaseName = toCamelCase(fileName);
        if (!enumObj[relativePath.split("/")[0]]) {
            enumObj[relativePath.split("/")[0]] = {};
        }
        enumObj[relativePath.split("/")[0]][camelCaseName] = relativePath;
    });

    return enumObj;
}

// 资源的根目录
const rootDir = './assets/Bundles';
// 需要查找的文件类型
const fileTypes = ['.prefab'];

const filePaths = findFiles(rootDir, fileTypes);
const enumResult = createEnum(filePaths, rootDir);

let fileModel = `/**\n * NOTE: This file is automatically generated, please do not edit it\n * \n * 每个Bundle中的资源引用路径\n */\nconst ResPaths = {\n`;
for (const bundleName in enumResult) {
    fileModel += `\n\t${bundleName}: {\n`;
    for (const resName in enumResult[bundleName]) {
        fileModel += `\t\t${resName}: "${enumResult[bundleName][resName]}",\n`;
    }
    fileModel += `\t},\n`;
}
fileModel += `\n};\n`;

// 去除 prefab 类型文件的后缀
fileModel = fileModel.replaceAll(".prefab", "");

fs.writeFileSync("./assets/Bundles/ResPaths.ts", fileModel);
