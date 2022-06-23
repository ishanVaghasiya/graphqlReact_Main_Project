const path = require("path");

const pdf = require("html-pdf");
const { assetsFolder } = require("../common/commonFunctions");

const optionNormal = {
  // height: '11.25in',
  // width: '8.5in',
  format: "Letter",
  orientation: "landscape",
  header: {
    height: "45mm",
  },
  footer: {
    height: "28mm",
  },
};

const createPDF = async (fileName, ejsData) => {
  return await new Promise((resolve, reject) => {
    const dirPath = path.join(
      __dirname,
      `../assets/${assetsFolder.reportFile}`
    );
    try {
      pdf
        .create(ejsData, optionNormal)
        .toFile(dirPath + "/" + fileName, (err, res) => {
          if (err) reject({ status: false, code: 202, message: err });
          else resolve({ status: true, filePath: fileName });
        });
    } catch (error) {
      reject({ status: false, code: 202, message: error.message });
    }
  });
};

module.exports.createPDF = createPDF;
