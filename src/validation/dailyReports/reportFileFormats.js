export const reportDocumentMimeTypes = [
  'application/msword', // .doc
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'text/plain', // .txt
  'application/rtf', // .rtf
  'application/vnd.oasis.opendocument.text', // .odt
  'application/vnd.ms-powerpoint', // .ppt
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
];

export const reportSpreadsheetMimeTypes = [
  'application/vnd.ms-excel', // .xls
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'text/csv', // .csv
  'application/csv',
  'text/x-csv',
  'application/vnd.oasis.opendocument.spreadsheet', // .ods
];

export const reportArchiveMimeTypes = [
  'application/zip', // .zip
  'application/x-rar-compressed', // .rar
  'application/x-7z-compressed', // .7z
];

export const reportPdfMimeTypes = ['application/pdf']; // .pdf

export const reportDocumentExtensions = [
  'doc',
  'docx',
  'txt',
  'rtf',
  'odt',
  'ppt',
  'pptx',
];

export const reportSpreadsheetExtensions = ['xls', 'xlsx', 'csv', 'ods'];

export const reportArchiveExtensions = ['zip', 'rar', '7z'];

export const reportPdfExtensions = ['pdf'];

export const allowedMimeTypes = [
  ...reportDocumentMimeTypes,
  ...reportSpreadsheetMimeTypes,
  ...reportPdfMimeTypes,
  ...reportArchiveMimeTypes,
];

export const allowedExtensions = [
  ...reportDocumentExtensions,
  ...reportSpreadsheetExtensions,
  ...reportPdfExtensions,
  ...reportArchiveExtensions,
];
