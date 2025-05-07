const fs = require("fs");

function restoreNestedObjectFromFile(filename) {
    const json = fs.readFileSync(filename, 'utf-8');
    const flatObj = JSON.parse(json);
    const result = {};

    for (const [path, value] of Object.entries(flatObj)) {
        const keys = path.split('.');
        let current = result;

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (i === keys.length - 1) {
                current[key] = value;
            } else {
                if (!(key in current)) {
                    current[key] = {};
                }
                current = current[key];
            }
        }
    }

    return result;
}
//console.log(restoreNestedObjectFromFile('fields.json'));
module.exports = { restoreNestedObjectFromFile };