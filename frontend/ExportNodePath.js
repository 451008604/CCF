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
            if (path.extname(file) != "" && fileTypes.includes(path.extname(file))) {
                results.push(filePath);
            }
        }
    }

    return results;
}

// 转换文件名为驼峰命名
function toCamelCase(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+|_+|-+)/g, (match) => {
        if (+match === 0 || match === '-') return ''; // 去除数字开头和`-`符号
        return match.toUpperCase();
    });
}

// 创建枚举
function createEnum(filePaths, rootDir) {
    const enumObj = {};
    filePaths.forEach(filePath => {
        const relativePath = path.relative(rootDir, filePath).replaceAll("\\", "/");
        const dirname = relativePath.split("/")[0];
        const camelCaseName = toCamelCase(path.basename(filePath)).replaceAll(".", "");
        enumObj[dirname] || (enumObj[dirname] = {});
        enumObj[dirname][camelCaseName] = relativePath;
    });
    return enumObj;
}

// 资源的根目录
const rootDir = './assets/Bundles';
const filePaths = findFiles(rootDir, ".prefab");
const enumResult = createEnum(filePaths, rootDir);

let result = {};
for (const key in enumResult) {
    const element = enumResult[key];
    for (const name in element) {
        const fileString = fs.readFileSync(rootDir + "/" + element[name], "utf-8");
        const fileJson = JSON.parse(fileString);
        result[name] ?? (result[name] = {});
        for (const jsonItem of fileJson) {
            generatedNodePath(fileJson, "", result[name], jsonItem);
            generatePrefabNodePath(fileJson, result[name], jsonItem);
        }
    }
}

/**
 * 生成节点路径
 * @param {Array} fileJson - 文件的JSON内容
 * @param {string} nodePath - 节点路径
 * @param {Object} map - 存储节点路径的映射对象
 * @param {Object} jsonItem - 当前处理的JSON项
 */
function generatedNodePath(fileJson, nodePath, map, jsonItem) {
    if (nodePath == "" && jsonItem["_parent"] != null) {
        return;
    }

    nodePath += (nodePath != "" ? "/" + jsonItem["_name"] : jsonItem["_name"]);
    if (jsonItem["_name"]) {
        if (nodePath != jsonItem["_name"]) {
            // 去除名称的根节点前缀
            const nodeKey = nodePath.slice(nodePath.indexOf("/") + 1);
            map[nodeKey.replaceAll("/", "_").replaceAll("-", "")] = nodePath.slice(nodePath.indexOf("/") + 1);
        }
    }

    if (jsonItem["_children"]) {
        for (const childJson of jsonItem["_children"]) {
            generatedNodePath(fileJson, nodePath, map, fileJson[childJson["__id__"]]);
        }
    }
}

/**
 * 生成预制体节点路径
 * @param {Array} fileJson - 文件的JSON内容
 * @param {Object} map - 存储节点路径的映射对象
 * @param {Object} jsonItem - 当前处理的JSON项
 */
function generatePrefabNodePath(fileJson, map, jsonItem) {
    if (jsonItem["_prefab"] && fileJson[jsonItem["_prefab"]["__id__"]]["instance"]) {
        // console.log(jsonItem);
        // console.log(fileJson[jsonItem["_parent"]["__id__"]]);
        // console.log(fileJson[jsonItem["_prefab"]["__id__"]]);
        // console.log(fileJson[fileJson[jsonItem["_prefab"]["__id__"]]["instance"]["__id__"]]);
        // console.log(fileJson[fileJson[jsonItem["_prefab"]["__id__"]]["instance"]["__id__"]]["propertyOverrides"]);

        let prefabPath = "";
        function getPrefabPath(prefabId) {
            prefabPath = fileJson[prefabId]["_name"] ? (fileJson[prefabId]["_name"] + "/" + prefabPath) : "";
            if (fileJson[prefabId]["_parent"]) {
                return getPrefabPath(fileJson[prefabId]["_parent"]["__id__"]);
            }
        }
        getPrefabPath(jsonItem["_parent"]["__id__"]);

        for (const element of fileJson[fileJson[jsonItem["_prefab"]["__id__"]]["instance"]["__id__"]]["propertyOverrides"]) {
            if (fileJson[element["__id__"]]["propertyPath"].includes("_name")) {
                prefabPath += fileJson[element["__id__"]]["value"];
                map[fileJson[element["__id__"]]["value"] + "Prefab"] = prefabPath.slice(prefabPath.indexOf("/") + 1);
            }
        }
    }
}

let copyResult = {};
// 处理引用预制体中的节点路径
for (const prefabName in result) {
    copyResult[prefabName] = {};
    for (const resName in result[prefabName]) {
        let value = result[prefabName][resName];
        let newKey = resName;
        if (resName.includes("Prefab")) {
            newKey = result[prefabName][resName].replaceAll("/", "_").replaceAll("-", "");
        }
        copyResult[prefabName][newKey] = value;

        for (const element in result[resName]) {
            copyResult[prefabName][newKey + "_" + element] = value + "/" + result[resName][element];
        }
    }
}


let fileModel = `/**\n * 每个Prefab中的节点引用路径。请不要手动修改此文件内容!!!\n * \n * This file is automatically generated, please do not edit it!!!\n */\nexport const NodePaths = {\n`;
for (const prefabName in copyResult) {
    fileModel += `\n\t${prefabName}: {\n`;
    for (const resName in copyResult[prefabName]) {
        fileModel += `\t\t"${resName}": "${copyResult[prefabName][resName]}",\n`;
    }
    fileModel += `\t},\n`;
}
fileModel += `\n};\n`;

fs.writeFileSync("./assets/Core/NodePaths.ts", fileModel);

console.log(`ExportNodePath.js 执行完毕`);
