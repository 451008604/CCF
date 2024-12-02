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
        return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
}

// 创建枚举
function createEnum(filePaths, rootDir) {
    const enumObj = {};

    filePaths.forEach(filePath => {
        const relativePath = path.relative(rootDir, filePath);
        const fileName = path.basename(filePath, path.extname(filePath));
        const camelCaseName = toCamelCase(fileName);

        enumObj[camelCaseName] = relativePath;
    });

    return enumObj;
}

// 使用示例
const rootDir = './assets';
const fileTypes = ['.js', '.ts', '.jsx', '.prefab']; // 需要查找的文件类型

const filePaths = findFiles(rootDir, fileTypes);
const enumResult = createEnum(filePaths, rootDir);

console.log(enumResult);