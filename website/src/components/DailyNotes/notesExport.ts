import ExcelJS from 'exceljs';

import {
  buildTodayReportTaskRows,
  formatDisplayDate,
  formatShortDate,
  getDayEntry,
  getQuickNoteForDay,
  listDayKeys,
  type DailyNotesStore,
  type DailyTask,
} from './notesStorage';

const BRAND_GREEN = '0F6E56';
const BRAND_GREEN_SOFT = 'E6F2EE';
const WARNING_AMBER = 'B45309';
const INK = '14201B';
const MUTED = '5C6B64';
const PAPER = 'F7F6F2';
const WHITE = 'FFFFFF';

function applyHeaderBar(
  sheet: ExcelJS.Worksheet,
  rowNumber: number,
  columnCount: number,
  title: string,
): void {
  sheet.mergeCells(rowNumber, 1, rowNumber, columnCount);
  const cell = sheet.getCell(rowNumber, 1);
  cell.value = title;
  cell.font = {bold: true, size: 16, color: {argb: `FF${WHITE}`}};
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: {argb: `FF${BRAND_GREEN}`},
  };
  cell.alignment = {vertical: 'middle', horizontal: 'left'};
  sheet.getRow(rowNumber).height = 28;
}

function styleSectionLabel(cell: ExcelJS.Cell, text: string): void {
  cell.value = text;
  cell.font = {bold: true, size: 12, color: {argb: `FF${BRAND_GREEN}`}};
}

function styleColumnHeaders(row: ExcelJS.Row, labels: string[]): void {
  labels.forEach((label, index) => {
    const cell = row.getCell(index + 1);
    cell.value = label;
    cell.font = {bold: true, color: {argb: `FF${INK}`}};
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: `FF${BRAND_GREEN_SOFT}`},
    };
    cell.border = {
      bottom: {style: 'thin', color: {argb: `FF${BRAND_GREEN}`}},
    };
  });
}

function addDoneCheckboxCell(cell: ExcelJS.Cell, done: boolean): void {
  cell.value = done;
  cell.alignment = {horizontal: 'center', vertical: 'middle'};
  cell.dataValidation = {
    type: 'list',
    allowBlank: false,
    formulae: ['"TRUE,FALSE"'],
    showErrorMessage: true,
    errorTitle: 'Done',
    error: 'Use TRUE or FALSE (or Insert → Checkbox in Excel 365).',
  };
  if (done) {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: `FF${BRAND_GREEN_SOFT}`},
    };
    cell.font = {color: {argb: `FF${BRAND_GREEN}`}, bold: true};
  }
}

function addTodaySheet(
  workbook: ExcelJS.Workbook,
  store: DailyNotesStore,
  todayKey: string,
): void {
  const sheet = workbook.addWorksheet('Today', {
    views: [{showGridLines: false}],
  });

  sheet.columns = [
    {key: 'done', width: 12},
    {key: 'task', width: 52},
    {key: 'from', width: 14},
  ];

  applyHeaderBar(sheet, 1, 3, 'Daily Notes Report');

  const dateCell = sheet.getCell(2, 1);
  sheet.mergeCells(2, 1, 2, 3);
  dateCell.value = formatDisplayDate(todayKey);
  dateCell.font = {size: 12, color: {argb: `FF${MUTED}`}};
  dateCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: {argb: `FF${PAPER}`},
  };

  const tipCell = sheet.getCell(3, 1);
  sheet.mergeCells(3, 1, 3, 3);
  tipCell.value =
    'Done column: set TRUE/FALSE to check or uncheck. In Excel 365 you can also select the Done cells → Insert → Checkbox.';
  tipCell.font = {size: 9, italic: true, color: {argb: `FF${MUTED}`}};
  tipCell.alignment = {wrapText: true};
  sheet.getRow(3).height = 32;

  styleSectionLabel(sheet.getCell(5, 1), 'Tasks');

  styleColumnHeaders(sheet.getRow(6), ['Done', 'Task', 'From']);

  const taskRows = buildTodayReportTaskRows(store, todayKey);
  let rowNumber = 7;

  if (taskRows.length === 0) {
    sheet.getCell(rowNumber, 2).value = 'No tasks for today.';
    sheet.getCell(rowNumber, 2).font = {
      italic: true,
      color: {argb: `FF${MUTED}`},
    };
    rowNumber += 1;
  } else {
    for (const taskRow of taskRows) {
      const row = sheet.getRow(rowNumber);
      addDoneCheckboxCell(row.getCell(1), taskRow.done);
      row.getCell(2).value = taskRow.text;
      row.getCell(2).font = {
        color: {
          argb: taskRow.fromDateKey ? `FF${WARNING_AMBER}` : `FF${INK}`,
        },
        strike: taskRow.done,
      };
      row.getCell(3).value = taskRow.fromDateKey
        ? formatShortDate(taskRow.fromDateKey)
        : 'Today';
      row.getCell(3).font = {
        color: {
          argb: taskRow.fromDateKey ? `FF${WARNING_AMBER}` : `FF${MUTED}`,
        },
      };
      rowNumber += 1;
    }
  }

  rowNumber += 1;
  styleSectionLabel(sheet.getCell(rowNumber, 1), 'Notes');
  rowNumber += 1;

  const notes = getQuickNoteForDay(store, todayKey).trim();
  sheet.mergeCells(rowNumber, 1, rowNumber + 4, 3);
  const notesCell = sheet.getCell(rowNumber, 1);
  notesCell.value = notes === '' ? '' : notes;
  notesCell.alignment = {vertical: 'top', wrapText: true};
  notesCell.border = {
    top: {style: 'thin', color: {argb: 'FFCCCCCC'}},
    left: {style: 'thin', color: {argb: 'FFCCCCCC'}},
    bottom: {style: 'thin', color: {argb: 'FFCCCCCC'}},
    right: {style: 'thin', color: {argb: 'FFCCCCCC'}},
  };
  notesCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: {argb: `FF${PAPER}`},
  };
  for (let offset = 0; offset <= 4; offset += 1) {
    sheet.getRow(rowNumber + offset).height = 18;
  }
}

function addAllTasksSheet(
  workbook: ExcelJS.Workbook,
  store: DailyNotesStore,
): void {
  const sheet = workbook.addWorksheet('All tasks', {
    views: [{state: 'frozen', ySplit: 1}],
  });

  sheet.columns = [
    {key: 'date', width: 14},
    {key: 'done', width: 10},
    {key: 'task', width: 56},
  ];

  styleColumnHeaders(sheet.getRow(1), ['Date', 'Done', 'Task']);

  let rowNumber = 2;
  for (const dateKey of listDayKeys(store)) {
    const tasks: DailyTask[] = getDayEntry(store, dateKey).tasks;
    for (const task of tasks) {
      const row = sheet.getRow(rowNumber);
      row.getCell(1).value = dateKey;
      addDoneCheckboxCell(row.getCell(2), task.done);
      row.getCell(3).value = task.text;
      row.getCell(3).font = {
        strike: task.done,
        color: {argb: task.done ? `FF${MUTED}` : `FF${INK}`},
      };
      rowNumber += 1;
    }
  }

  if (rowNumber === 2) {
    sheet.getCell(2, 3).value = 'No tasks saved yet.';
    sheet.getCell(2, 3).font = {
      italic: true,
      color: {argb: `FF${MUTED}`},
    };
  }
}

export async function buildNotesXlsxBuffer(
  store: DailyNotesStore,
  todayKey: string,
): Promise<ArrayBuffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Sudip AI Playbook';
  workbook.created = new Date();
  workbook.modified = new Date();

  addTodaySheet(workbook, store, todayKey);
  addAllTasksSheet(workbook, store);

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer as ArrayBuffer;
}

export async function downloadNotesXlsx(
  store: DailyNotesStore,
  todayKey: string,
): Promise<void> {
  const buffer = await buildNotesXlsxBuffer(store, todayKey);
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `daily-notes-${todayKey}.xlsx`;
  link.click();
  URL.revokeObjectURL(url);
}
