// SECTION - Uplaod Daily Reports Loading
export const selectDailyReportsUploadLoading = (state) =>
  state.dailyReports.uploadLoading;

export const selectDailyReportsLoading = (state) =>
  state.dailyReports.reportsLoading;

//SECTION - Get Daily Reports Items
export const selectDailyReportsItems = (state) =>
  state.dailyReports.dailyReportsItems;

export const selectDailyReportsMeta = (state) => state.dailyReports.meta;

export const selectDailyReportsError = (state) =>
  state.dailyReports.error;

export const selectDailyReportsSuccessMessage = (state) =>
  state.dailyReports.successMessage;
