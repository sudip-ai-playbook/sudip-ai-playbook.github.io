import type {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  ReactNode,
} from 'react';
import {useEffect, useState} from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';
import Heading from '@theme/Heading';

import styles from './DailyNotes.module.css';
import {downloadNotesXlsx} from './notesExport';
import {
  createEmptyStore,
  createTask,
  formatDateKey,
  formatDisplayDate,
  formatShortDate,
  getQuickNoteForDay,
  getTasksForDay,
  isValidDateKey,
  listCompletedTasksByDate,
  listIncompleteTasksExcludingDay,
  loadDailyNotesStore,
  saveDailyNotesStore,
  setQuickNoteForDay,
  setTasksForDay,
  updateTaskText,
  type DailyNotesStore,
  type DailyTask,
} from './notesStorage';

function updateTaskDone(
  tasks: DailyTask[],
  taskId: string,
  done: boolean,
): DailyTask[] {
  return tasks.map((task) =>
    task.id === taskId ? {...task, done} : task,
  );
}

function removeTask(tasks: DailyTask[], taskId: string): DailyTask[] {
  return tasks.filter((task) => task.id !== taskId);
}

type TaskRowProps = {
  task: DailyTask;
  dateKey: string;
  dateTag?: string;
  onToggle: (dateKey: string, taskId: string, done: boolean) => void;
  onEdit: (dateKey: string, taskId: string, text: string) => void;
  onDelete: (dateKey: string, taskId: string) => void;
};

function TaskRow({
  task,
  dateKey,
  dateTag,
  onToggle,
  onEdit,
  onDelete,
}: TaskRowProps): ReactNode {
  const [draft, setDraft] = useState(task.text);

  useEffect(() => {
    setDraft(task.text);
  }, [task.text]);

  function handleToggle(event: ChangeEvent<HTMLInputElement>): void {
    onToggle(dateKey, task.id, event.target.checked);
  }

  function handleDraftChange(event: ChangeEvent<HTMLInputElement>): void {
    setDraft(event.target.value);
  }

  function handleDraftBlur(): void {
    if (draft.trim() !== '' && draft.trim() !== task.text) {
      onEdit(dateKey, task.id, draft);
    } else {
      setDraft(task.text);
    }
  }

  function handleDraftKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === 'Enter') {
      event.currentTarget.blur();
    }
  }

  function handleDelete(): void {
    onDelete(dateKey, task.id);
  }

  const isCarryover = dateTag !== undefined;

  return (
    <li
      className={isCarryover ? styles.carryoverItem : styles.taskItem}
      data-testid={
        isCarryover
          ? `daily-notes-open-${task.id}`
          : `daily-notes-task-${task.id}`
      }>
      <div className={styles.taskMain}>
        <label className={styles.taskLabel}>
          <input
            type="checkbox"
            checked={task.done}
            onChange={handleToggle}
            data-testid={`daily-notes-checkbox-${task.id}`}
          />
          {dateTag ? (
            <span className={styles.dateTag} data-testid={`daily-notes-date-tag-${task.id}`}>
              {dateTag}
            </span>
          ) : null}
          <input
            className={
              task.done
                ? styles.taskEditDone
                : isCarryover
                  ? styles.carryoverEdit
                  : styles.taskEdit
            }
            type="text"
            value={draft}
            onChange={handleDraftChange}
            onBlur={handleDraftBlur}
            onKeyDown={handleDraftKeyDown}
            aria-label="Edit task"
            data-testid={`daily-notes-edit-${task.id}`}
          />
        </label>
        <button
          type="button"
          className={styles.deleteButton}
          onClick={handleDelete}
          aria-label={`Delete task ${task.text}`}
          data-testid={`daily-notes-delete-${task.id}`}>
          ×
        </button>
      </div>
    </li>
  );
}

export default function DailyNotes(): ReactNode {
  const isBrowser = useIsBrowser();
  const todayKey = formatDateKey(new Date());
  const [selectedDateKey, setSelectedDateKey] = useState(todayKey);
  const [store, setStore] = useState<DailyNotesStore>(createEmptyStore);
  const [draftText, setDraftText] = useState('');
  const [pickerDate, setPickerDate] = useState(todayKey);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    if (!isBrowser) {
      return;
    }
    setStore(loadDailyNotesStore());
    setHasHydrated(true);
  }, [isBrowser]);

  function persistStore(nextStore: DailyNotesStore): void {
    setStore(nextStore);
    if (isBrowser) {
      saveDailyNotesStore(nextStore);
    }
  }

  function handlePickerChange(event: ChangeEvent<HTMLInputElement>): void {
    const nextDate = event.target.value;
    setPickerDate(nextDate);
    if (isValidDateKey(nextDate)) {
      setSelectedDateKey(nextDate);
    }
  }

  function handleDraftChange(event: ChangeEvent<HTMLInputElement>): void {
    setDraftText(event.target.value);
  }

  function handleAddTask(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const task = createTask(draftText);
    if (!task) {
      return;
    }
    const currentTasks = getTasksForDay(store, selectedDateKey);
    persistStore(
      setTasksForDay(store, selectedDateKey, [...currentTasks, task]),
    );
    setDraftText('');
  }

  function handleToggle(
    dateKey: string,
    taskId: string,
    done: boolean,
  ): void {
    const currentTasks = getTasksForDay(store, dateKey);
    persistStore(
      setTasksForDay(
        store,
        dateKey,
        updateTaskDone(currentTasks, taskId, done),
      ),
    );
  }

  function handleEdit(dateKey: string, taskId: string, text: string): void {
    persistStore(updateTaskText(store, dateKey, taskId, text));
  }

  function handleDelete(dateKey: string, taskId: string): void {
    const currentTasks = getTasksForDay(store, dateKey);
    persistStore(
      setTasksForDay(store, dateKey, removeTask(currentTasks, taskId)),
    );
  }

  function handleQuickNoteChange(event: ChangeEvent<HTMLTextAreaElement>): void {
    persistStore(
      setQuickNoteForDay(store, selectedDateKey, event.target.value),
    );
  }

  function handleOpenToday(): void {
    setSelectedDateKey(todayKey);
    setPickerDate(todayKey);
  }

  function handleDownload(): void {
    void downloadNotesXlsx(store, todayKey).catch(() => {
      // Keep the page usable if the workbook write fails in an older browser.
    });
  }

  const isToday = selectedDateKey === todayKey;
  const dayTasks = getTasksForDay(store, selectedDateKey);
  const openTasks = dayTasks.filter((task) => !task.done);
  const carryovers = isToday
    ? listIncompleteTasksExcludingDay(store, todayKey)
    : [];
  const quickNote = getQuickNoteForDay(store, selectedDateKey);
  const completedGroups = listCompletedTasksByDate(store);
  const completedCount = completedGroups.reduce(
    (total, group) => total + group.tasks.length,
    0,
  );
  const hasAnyTasks = carryovers.length > 0 || openTasks.length > 0;

  if (!hasHydrated) {
    return (
      <div className={styles.root} data-testid="daily-notes-loading">
        <p className={styles.loading}>Loading…</p>
      </div>
    );
  }

  return (
    <div className={styles.root} data-testid="daily-notes">
      <header className={styles.header}>
        <div className={styles.headerRow}>
          <Heading as="h1" className={styles.title}>
            {formatDisplayDate(selectedDateKey)}
          </Heading>
          <button
            type="button"
            className={styles.downloadButton}
            onClick={handleDownload}
            data-testid="daily-notes-download">
            Download Excel
          </button>
        </div>
        <div className={styles.pickerRow}>
          <input
            id="daily-notes-date-picker"
            className={styles.datePicker}
            type="date"
            value={pickerDate}
            onChange={handlePickerChange}
            aria-label="Open date"
            data-testid="daily-notes-date-picker"
          />
          {!isToday ? (
            <button
              type="button"
              className={styles.todayLink}
              onClick={handleOpenToday}
              data-testid="daily-notes-open-today">
              Today
            </button>
          ) : null}
        </div>
      </header>

      <section className={styles.tasksSection} aria-labelledby="daily-notes-tasks">
        <Heading as="h2" id="daily-notes-tasks" className={styles.sectionHeading}>
          Tasks
        </Heading>

        <form className={styles.addForm} onSubmit={handleAddTask}>
          <label className={styles.srOnly} htmlFor="daily-notes-input">
            New task
          </label>
          <input
            id="daily-notes-input"
            className={styles.input}
            type="text"
            value={draftText}
            onChange={handleDraftChange}
            placeholder="Add a task"
            autoComplete="off"
            data-testid="daily-notes-input"
          />
          <button
            type="submit"
            className={styles.addButton}
            data-testid="daily-notes-add">
            Add
          </button>
        </form>

        {!hasAnyTasks ? (
          <p className={styles.empty} data-testid="daily-notes-empty">
            No tasks for this day.
          </p>
        ) : (
          <ul className={styles.taskList} data-testid="daily-notes-list">
            {carryovers.map((item) => (
              <TaskRow
                key={`${item.dateKey}-${item.task.id}`}
                task={item.task}
                dateKey={item.dateKey}
                dateTag={formatShortDate(item.dateKey)}
                onToggle={handleToggle}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
            {openTasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                dateKey={selectedDateKey}
                onToggle={handleToggle}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        )}
      </section>

      <section
        className={styles.notesSection}
        aria-labelledby="daily-notes-notes">
        <Heading as="h2" id="daily-notes-notes" className={styles.sectionHeading}>
          Notes
        </Heading>
        <label className={styles.srOnly} htmlFor="daily-notes-quick-note">
          Notes for this day
        </label>
        <textarea
          id="daily-notes-quick-note"
          className={styles.textarea}
          value={quickNote}
          onChange={handleQuickNoteChange}
          placeholder="Notes…"
          rows={5}
          data-testid="daily-notes-quick-note"
        />
      </section>

      {completedCount > 0 ? (
        <details
          className={styles.completedSection}
          data-testid="daily-notes-completed">
          <summary className={styles.completedSummary}>
            Completed ({completedCount})
          </summary>
          <div className={styles.completedBody}>
            {completedGroups.map((group) => (
              <div
                key={group.dateKey}
                className={styles.completedGroup}
                data-testid={`daily-notes-completed-${group.dateKey}`}>
                <p className={styles.completedDate}>
                  {group.dateKey === todayKey
                    ? 'Today'
                    : formatShortDate(group.dateKey)}
                </p>
                <ul className={styles.completedList}>
                  {group.tasks.map((task) => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      dateKey={group.dateKey}
                      onToggle={handleToggle}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </details>
      ) : null}
    </div>
  );
}
