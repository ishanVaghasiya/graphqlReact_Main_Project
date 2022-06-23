const fs = require("fs");
const path = require("path");
const xl = require("excel4node");
const ejs = require("ejs");

const assetsFolder = {
  reportFile: "report",
  downloadFileUrl: "/download/files/",
};

const fileNameInitial = async (fileName) => {
  const getTime = new Date();
  const fileTime = `${getTime.getMonth()}${getTime.getDate()}${getTime.getHours()}${getTime.getMinutes()}${getTime.getSeconds()}`;
  return fileTime + "_" + fileName;
};

const createExcel = async (wsName, headingColumnNames, data, fileName) => {
  try {
    const wb = new xl.Workbook();
    const ws = wb.addWorksheet(wsName);

    let headingColumnIndex = 1;
    headingColumnNames.forEach((heading) => {
      ws.cell(1, headingColumnIndex++).string(heading);
    });

    let rowIndex = 2;
    let value = "";
    data.forEach((record) => {
      let columnIndex = 1;
      Object.keys(record).forEach((columnName) => {
        value = record[columnName] ? "" + record[columnName] : "";
        ws.cell(rowIndex, columnIndex++).string(value);
      });
      rowIndex++;
    });

    const dirPath = path.join(
      __dirname,
      `../assets/${assetsFolder.reportFile}`
    );

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    fileName = await fileNameInitial(fileName);
    wb.write(dirPath + "/" + fileName);
    return { status: true, fileName };
  } catch (error) {
    return { status: false, message: error.message };
  }
};

// It takes the html template and json data and creates combined html string which will be shown as table form data in the pdf.
const ejsData = async (template, data, ptName, columnsNames) => {
  const pt = ptName;
  const pdfTemplatePath = path.join(__dirname, `./reportTemplate/${template}`);
  return await ejs.renderFile(path.join(pdfTemplatePath), {
    data: data,
    pdfTitle: pt,
    columns: columnsNames,
  });
};

module.exports = {
  assetsFolder,
  createExcel,
  ejsData,
  fileNameInitial,
};
