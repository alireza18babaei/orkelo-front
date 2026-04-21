import {
  allowedExtensions,
  reportArchiveExtensions,
  reportPdfExtensions,
  reportSpreadsheetExtensions,
} from '../validation/dailyReports/reportFileFormats';

const toExtension = (name = '') =>
  String(name)
    .split('.')
    .pop()
    ?.trim()
    .toLowerCase();

export const getReportFileIcon = (name = '') => {
  const extension = toExtension(name);

  if (!extension) return '/assets/images/icons/file.png';
  if (reportPdfExtensions.includes(extension)) {
    return '/assets/images/icons/pdf.png';
  }
  if (reportSpreadsheetExtensions.includes(extension)) {
    return '/assets/images/icons/excel.png';
  }
  if (extension === 'rar' || extension === '7z') {
    return '/assets/images/icons/rar.png';
  }
  if (reportArchiveExtensions.includes(extension)) {
    return '/assets/images/icons/zip.png';
  }
  if (allowedExtensions.includes(extension)) {
    return '/assets/images/icons/file.png';
  }

  return '/assets/images/icons/file.png';
};
