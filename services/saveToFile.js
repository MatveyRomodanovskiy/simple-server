const fs = require('fs');
const id = Symbol("id");
const person = {
    name: "Sara",
    age: 25,
    address: {
        country: "USA",
        city: "New York",
        address: "123 Main St",
        zip: 10001,
        location:{
            lat: 40.7128,
            long: -74.0060,
        }
    },
    contacts: {
        phone: "123-456-7890",
        email: "<EMAIL>"
    },
    emergencyContacts: {
        name: "John",
        phone: "123-456-7890",
        email: "<EMAIL>"
    },
    [id]: 12345
}
function deepCollectPrimitiveFields(obj, map = new Map(), seen = new WeakSet(), path = '') {
    if(obj===null || typeof obj !== 'object' || seen.has(obj)) {
        return map;
    }
    seen.add(obj);
    for (const key of Reflect.ownKeys(obj)) {
        const newPath = path ? `${path}.${key.toString()}` : key.toString();
        const value = obj[key];
        if (value === null || typeof value !== 'object') {
            map.set(newPath, value);
        } else  {
            deepCollectPrimitiveFields(value, map, seen, newPath);
        }
    }
    return map;
}
console.log(deepCollectPrimitiveFields(person));
function saveMapToFile(map, filename = 'fields.json') {
    let json = '{\n';

    let i = 0;
    for (const [key, value] of map) {
        const line = `  ${JSON.stringify(key)}: ${JSON.stringify(value)}`;
        json += line;
        if (i < map.size - 1) json += ',\n';
        i++;
    }

    json += '\n}';

    const fs = require('fs');
    fs.writeFileSync(filename, json, 'utf-8');

    console.log(`Saved to ${filename}`);
}
saveMapToFile(deepCollectPrimitiveFields(person));