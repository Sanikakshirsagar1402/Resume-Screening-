const pdfParse = require("pdf-parse");
const fs = require("fs");

resumeParser = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
};
 exports = resumeParser ;