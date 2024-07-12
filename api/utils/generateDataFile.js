const fs = require("fs");
const generateDataFile = async (path, fileName) => {
  let data;

  try {
    data = await fs.promises.readFile(path + fileName, "utf-8");

    return JSON.parse(data);
  } catch {
    data = [];

    if (!fs.existsSync(path)) {
      await fs.promises.mkdir(path);
    }

    await fs.promises.writeFile(path + fileName, JSON.stringify(data));

    return data;
  }
};

module.exports = generateDataFile;
