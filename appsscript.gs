const SPREADSHEET = SpreadsheetApp.getActiveSpreadsheet();

function getSearchConsoleSites() {
  const setupSheet = getSheetByName_("Setup");
  const sitesSheet = getSheetByName_("Settings");
  const oauthToken = ScriptApp.getOAuthToken();
  const url = "https://www.googleapis.com/webmasters/v3/sites";

  const response = UrlFetchApp.fetch(url, {
    headers: buildAuthHeaders_(oauthToken),
    method: "GET",
  }).getContentText();

  const json = JSON.parse(response);
  const siteUrls = (json.siteEntry || []).map((site) => [site.siteUrl]);

  if (!siteUrls.length) {
    setupSheet
      .getRange(11, 2)
      .setValue("No sites returned. Check Search Console access.");
    return;
  }

  sitesSheet.getRange(2, 1, siteUrls.length, 1).setValues(siteUrls);
}

function searchConsoleAnalytics() {
  const setupSheet = getSheetByName_("Setup");
  const analyticsSheet = getSheetByName_("Analytics");
  const oauthToken = ScriptApp.getOAuthToken();
  const siteUrl = setupSheet.getRange(7, 2).getValue();
  const duration = setupSheet.getRange(8, 2).getValue();

  resetAnalyticsSheet_(analyticsSheet);

  const { startDate, endDate } = getDateRange_(duration);
  const rowLimit = setupSheet.getRange(9, 2).getValue();

  const payload = {
    startDate,
    endDate,
    dimensions: ["QUERY"],
    rowLimit,
  };

  const response = UrlFetchApp.fetch(buildSearchConsoleUrl_(siteUrl), {
    headers: buildAuthHeaders_(oauthToken),
    method: "POST",
    payload: JSON.stringify(payload),
  }).getContentText();

  const json = JSON.parse(response);
  if (!json.rows || !json.rows.length) {
    analyticsSheet
      .getRange(5, 1)
      .setValue("Not enough data. You might want to change the date range.");
    return;
  }

  const dataArray = json.rows.map((row) => [
    row.keys[0],
    row.clicks,
    row.impressions,
    row.ctr * 100,
    row.position,
  ]);

  analyticsSheet
    .getRange(5, 2, dataArray.length, dataArray[0].length)
    .setValues(dataArray);
  analyticsSheet.getRange(5, 1, dataArray.length, 1).insertCheckboxes();

  const totals = dataArray.reduce(
    (acc, row) => {
      acc.clicks += row[1];
      acc.impressions += row[2];
      acc.positions += row[4];
      return acc;
    },
    { clicks: 0, impressions: 0, positions: 0 }
  );

  const avgPosition = dataArray.length
    ? totals.positions / dataArray.length
    : 0;

  analyticsSheet.getRange(5, 8).setValue("Total Clicks");
  analyticsSheet.getRange(7, 8).setValue(totals.clicks);
  analyticsSheet.getRange(10, 8).setValue("Total Impressions");
  analyticsSheet.getRange(12, 8).setValue(totals.impressions);
  analyticsSheet.getRange(15, 8).setValue("Average Position");
  analyticsSheet.getRange(17, 8).setValue(avgPosition);

  const range = analyticsSheet.getRange(5, 1, dataArray.length, 6);
  range.getBandings().forEach((banding) => banding.remove());
  range.applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, false, false);
  analyticsSheet.setRowHeights(5, dataArray.length, 35);
}

function addtoTracker() {
  const trackerSheet = getSheetByName_("Rank Tracker");
  const analyticsSheet = getSheetByName_("Analytics");
  const sitesSheet = getSheetByName_("Settings");
  const lastRow = analyticsSheet.getLastRow();
  const data = analyticsSheet
    .getRange(5, 1, lastRow - 4, analyticsSheet.getLastColumn() - 1)
    .getValues();

  const values = sitesSheet.getRange("B2:B102").getValues();
  const dataValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(values)
    .build();

  data.forEach((row) => {
    if (row[0] === true && row[1]) {
      trackerSheet.appendRow([row[1]]);
    }
  });

  const trackerLastRow = trackerSheet.getLastRow();
  if (trackerLastRow < 6) {
    return;
  }

  const range = trackerSheet.getRange(6, 1, trackerLastRow - 5, 1);
  trackerSheet
    .getRange(6, 2, trackerLastRow - 5, 1)
    .setDataValidation(dataValidation);
  range.getBandings().forEach((banding) => banding.remove());
  trackerSheet.setRowHeights(6, trackerLastRow - 5, 35);
}

function getKeywordPosition() {
  const setupSheet = getSheetByName_("Setup");
  const trackerSheet = getSheetByName_("Rank Tracker");
  const oauthToken = ScriptApp.getOAuthToken();
  const siteUrl = setupSheet.getRange(7, 2).getValue();
  const lastRow = trackerSheet.getLastRow();

  const { startDate, endDate } = getLaggedDateRange_(3);
  trackerSheet.getRange(5, trackerSheet.getLastColumn() + 1).setValue(startDate);

  const data = trackerSheet
    .getRange(6, 1, lastRow - 5, trackerSheet.getLastColumn())
    .getValues();

  const url = buildSearchConsoleUrl_(siteUrl);

  data.forEach((row, index) => {
    const expression = row[0];
    if (!expression) {
      return;
    }

    const payload = {
      startDate,
      endDate,
      dimensionFilterGroups: [
        {
          filters: [
            {
              dimension: "QUERY",
              expression,
            },
          ],
        },
      ],
    };

    const response = UrlFetchApp.fetch(url, {
      headers: buildAuthHeaders_(oauthToken),
      method: "POST",
      payload: JSON.stringify(payload),
    }).getContentText();

    const json = JSON.parse(response);
    const position = json.rows && json.rows.length ? json.rows[0].position : "";
    const targetCell = trackerSheet.getRange(
      6 + index,
      trackerSheet.getLastColumn()
    );

    if (position !== "") {
      targetCell.setValue(position.toFixed(2));
    } else {
      targetCell.setValue("");
    }

    const currentValue = Number(targetCell.getValue());
    const previousValue = Number(
      trackerSheet
        .getRange(6 + index, trackerSheet.getLastColumn() - 1)
        .getValue()
    );

    if (!Number.isNaN(currentValue) && !Number.isNaN(previousValue)) {
      if (currentValue - previousValue === 0) {
        targetCell.setBackground("#feffd6");
      } else if (currentValue - previousValue > 0) {
        targetCell.setBackground("#f4cccc");
      } else if (currentValue - previousValue < 0) {
        targetCell.setBackground("#e0ffcc");
      }
    }
  });
}

function dailyTrendAnalytics() {
  const setupSheet = getSheetByName_("Setup");
  const trendSheet = getSheetByName_("Daily Trend Charts");
  const oauthToken = ScriptApp.getOAuthToken();
  const lastRow = trendSheet.getLastRow();

  if (lastRow !== 13) {
    trendSheet.getRange(14, 1, lastRow - 13, 6).clearContent();
  }

  const startDate = trendSheet.getRange(4, 2).getDisplayValue();
  const endDate = trendSheet.getRange(5, 2).getDisplayValue();
  const data = trendSheet.getRange(6, 2, 5, 1).getValues();
  const siteUrl = setupSheet.getRange(7, 2).getValue();
  const url = buildSearchConsoleUrl_(siteUrl);

  data.forEach((row, index) => {
    const expression = row[0];
    if (!expression) {
      return;
    }

    const payload = {
      startDate,
      endDate,
      dimensionFilterGroups: [
        {
          filters: [
            {
              dimension: "QUERY",
              expression,
            },
          ],
        },
      ],
      dimensions: ["DATE"],
    };

    const response = UrlFetchApp.fetch(url, {
      headers: buildAuthHeaders_(oauthToken),
      method: "POST",
      payload: JSON.stringify(payload),
    }).getContentText();

    const json = JSON.parse(response);
    const rows = json.rows || [];
    const dateArray = rows.map((rowData) => [rowData.keys[0]]);
    const positionArray = rows.map((rowData) => [
      Number(rowData.position).toFixed(0),
    ]);

    if (!dateArray.length) {
      return;
    }

    trendSheet.getRange(14, 1, dateArray.length, 1).setValues(dateArray);
    trendSheet
      .getRange(14, 2 + index, positionArray.length, 1)
      .setValues(positionArray);

    const range = trendSheet.getRange(14, 1, dateArray.length, 6);
    range.getBandings().forEach((banding) => banding.remove());
    range.applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, false, false);
    trendSheet.setRowHeights(14, dateArray.length, 35);
  });
}

function resetAnalyticsSheet_(analyticsSheet) {
  const lastRow = analyticsSheet.getLastRow();
  if (lastRow > 4) {
    analyticsSheet.getRange("A:A").removeCheckboxes();
    analyticsSheet
      .getRange(5, 2, lastRow - 4, analyticsSheet.getLastColumn() - 1)
      .clearContent();
    analyticsSheet.getRange(7, 8, 14, 1).clearContent();
  }
}

function getDateRange_(duration) {
  const today = new Date();
  let startDate;

  if (duration === "Last 7 Days") {
    startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  } else if (duration === "Last 28 Days") {
    startDate = new Date(today.getTime() - 28 * 24 * 60 * 60 * 1000);
  } else if (duration === "Last 3 Months") {
    startDate = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());
  } else if (duration === "Last 6 Months") {
    startDate = new Date(today.getFullYear(), today.getMonth() - 6, today.getDate());
  } else if (duration === "Last 12 Months") {
    startDate = new Date(today.getFullYear(), today.getMonth() - 12, today.getDate());
  } else {
    startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  }

  return {
    startDate: Utilities.formatDate(
      startDate,
      Session.getScriptTimeZone(),
      "YYYY-MM-dd"
    ),
    endDate: Utilities.formatDate(
      today,
      SpreadsheetApp.getActive().getSpreadsheetTimeZone(),
      "YYYY-MM-dd"
    ),
  };
}

function getLaggedDateRange_(daysLag) {
  const today = new Date();
  const lagDate = new Date(today.getTime() - daysLag * 24 * 60 * 60 * 1000);
  const dateValue = Utilities.formatDate(
    lagDate,
    Session.getScriptTimeZone(),
    "YYYY-MM-dd"
  );

  return { startDate: dateValue, endDate: dateValue };
}

function buildSearchConsoleUrl_(siteUrl) {
  if (siteUrl.startsWith("sc-domain:")) {
    return `https://www.googleapis.com/webmasters/v3/sites/${siteUrl}/searchAnalytics/query`;
  }

  return `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
    siteUrl
  )}/searchAnalytics/query`;
}

function buildAuthHeaders_(oauthToken) {
  return {
    Authorization: `Bearer ${oauthToken}`,
    "Content-Type": "application/json",
  };
}

function getSheetByName_(name) {
  const sheet = SPREADSHEET.getSheetByName(name);
  if (!sheet) {
    throw new Error(`Missing required sheet: ${name}`);
  }
  return sheet;
}
