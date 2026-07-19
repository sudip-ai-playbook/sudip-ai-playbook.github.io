import type {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  SyntheticEvent,
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
  FUTURE_SECTION_LABEL,
  getQuickNoteForDay,
  getTasksForDay,
  isValidDateKey,
  listCompletedTasksByDate,
  listFutureIncompleteTasks,
  listPastIncompleteTasks,
  listPastQuickNotes,
  loadDailyNotesStore,
  PAST_NOTES_SECTION_LABEL,
  PAST_SECTION_LABEL,
  saveDailyNotesStore,
  setQuickNoteForDay,
  setTasksForDay,
  shouldExpandDaySection,
  updateTaskText,
  type DailyNotesStore,
  type DailyTask,
  type IncompleteTaskRef,
  type PastQuickNoteRef,
} from './notesStorage';

type TaskTone = 'future' | 'past';

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
  tone?: TaskTone;
  onToggle: (dateKey: string, taskId: string, done: boolean) => void;
  onEdit: (dateKey: string, taskId: string, text: string) => void;
  onDelete: (dateKey: string, taskId: string) => void;
  onOpenDate?: (dateKey: string) => void;
};

function resolveDateTagClass(tone: TaskTone | undefined): string {
  if (tone === 'future') {
    return styles.dateTagFuture;
  }
  if (tone === 'past') {
    return styles.dateTagPast;
  }
  return styles.dateTag;
}

function resolveEditClass(
  done: boolean,
  tone: TaskTone | undefined,
): string {
  if (done) {
    return styles.taskEditDone;
  }
  if (tone === 'future') {
    return styles.futureEdit;
  }
  if (tone === 'past') {
    return styles.pastEdit;
  }
  return styles.taskEdit;
}

function TaskRow({
  task,
  dateKey,
  dateTag,
  tone,
  onToggle,
  onEdit,
  onDelete,
  onOpenDate,
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

  function handleOpenDate(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    event.stopPropagation();
    onOpenDate?.(dateKey);
  }

  const isDated = dateTag !== undefined;
  const itemClassName = isDated
    ? tone === 'future'
      ? styles.futureItem
      : styles.pastItem
    : styles.taskItem;

  return (
    <li
      className={itemClassName}
      data-testid={
        isDated
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
          {dateTag && onOpenDate ? (
            <button
              type="button"
              className={resolveDateTagClass(tone)}
              onClick={handleOpenDate}
              aria-label={`Open ${dateTag}`}
              data-testid={`daily-notes-date-tag-${task.id}`}>
              {dateTag}
            </button>
          ) : dateTag ? (
            <span
              className={resolveDateTagClass(tone)}
              data-testid={`daily-notes-date-tag-${task.id}`}>
              {dateTag}
            </span>
          ) : null}
          <input
            className={resolveEditClass(task.done, tone)}
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

type DaySectionProps = {
  label: string;
  testId: string;
  tasks: IncompleteTaskRef[];
  tone: TaskTone;
  onToggle: (dateKey: string, taskId: string, done: boolean) => void;
  onEdit: (dateKey: string, taskId: string, text: string) => void;
  onDelete: (dateKey: string, taskId: string) => void;
  onOpenDate: (dateKey: string) => void;
};

function DaySection({
  label,
  testId,
  tasks,
  tone,
  onToggle,
  onEdit,
  onDelete,
  onOpenDate,
}: DaySectionProps): ReactNode {
  const [isOpen, setIsOpen] = useState(() =>
    shouldExpandDaySection(tasks.length),
  );

  function handleSectionToggle(
    event: SyntheticEvent<HTMLDetailsElement>,
  ): void {
    setIsOpen(event.currentTarget.open);
  }

  return (
    <details
      className={styles.daySection}
      open={isOpen}
      onToggle={handleSectionToggle}
      data-testid={testId}>
      <summary className={styles.daySectionSummary}>
        {label} ({tasks.length})
      </summary>
      <ul className={styles.taskList} data-testid={`${testId}-list`}>
        {tasks.map((item) => (
          <TaskRow
            key={`${item.dateKey}-${item.task.id}`}
            task={item.task}
            dateKey={item.dateKey}
            dateTag={formatShortDate(item.dateKey)}
            tone={tone}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
            onOpenDate={onOpenDate}
          />
        ))}
      </ul>
    </details>
  );
}

type PastNotesSectionProps = {
  notes: PastQuickNoteRef[];
  onOpenDate: (dateKey: string) => void;
};

function PastNotesSection({
  notes,
  onOpenDate,
}: PastNotesSectionProps): ReactNode {
  const [isOpen, setIsOpen] = useState(false);

  function handleSectionToggle(
    event: SyntheticEvent<HTMLDetailsElement>,
  ): void {
    setIsOpen(event.currentTarget.open);
  }

  function handlePastNoteDateClick(
    event: MouseEvent<HTMLButtonElement>,
  ): void {
    event.preventDefault();
    const dateKey = event.currentTarget.dataset.dateKey;
    if (dateKey) {
      onOpenDate(dateKey);
    }
  }

  return (
    <details
      className={styles.pastNotesSection}
      open={isOpen}
      onToggle={handleSectionToggle}
      data-testid="daily-notes-past-notes">
      <summary className={styles.pastNotesSummary}>
        {PAST_NOTES_SECTION_LABEL} ({notes.length})
      </summary>
      <div className={styles.pastNotesBody}>
        {notes.map((item) => (
          <article
            key={item.dateKey}
            className={styles.pastNoteItem}
            data-testid={`daily-notes-past-note-${item.dateKey}`}>
            <button
              type="button"
              className={styles.pastNoteDate}
              data-date-key={item.dateKey}
              onClick={handlePastNoteDateClick}
              aria-label={`Open ${formatShortDate(item.dateKey)}`}
              data-testid={`daily-notes-past-note-date-${item.dateKey}`}>
              {formatShortDate(item.dateKey)}
            </button>
            <p className={styles.pastNoteText}>{item.quickNote}</p>
          </article>
        ))}
      </div>
    </details>
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

  function handleOpenDate(dateKey: string): void {
    if (!isValidDateKey(dateKey)) {
      return;
    }
    setSelectedDateKey(dateKey);
    setPickerDate(dateKey);
  }

  function handleDownload(): void {
    void downloadNotesXlsx(store, todayKey).catch(() => {
      // Keep the page usable if the workbook write fails in an older browser.
    });
  }

  const isToday = selectedDateKey === todayKey;
  const dayTasks = getTasksForDay(store, selectedDateKey);
  const openTasks = dayTasks.filter((task) => !task.done);
  const futureTasks = isToday
    ? listFutureIncompleteTasks(store, todayKey)
    : [];
  const pastTasks = isToday
    ? listPastIncompleteTasks(store, todayKey)
    : [];
  const quickNote = getQuickNoteForDay(store, selectedDateKey);
  const completedGroups = listCompletedTasksByDate(store);
  const completedCount = completedGroups.reduce(
    (total, group) => total + group.tasks.length,
    0,
  );
  const pastQuickNotes = listPastQuickNotes(store, todayKey);
  const hasFutureEntries = futureTasks.length > 0;
  const hasPastEntries = pastTasks.length > 0;
  const hasTodayOpenTasks = openTasks.length > 0;
  const hasAnyTasks =
    hasFutureEntries || hasTodayOpenTasks || hasPastEntries;
  const showFuturePastBoard =
    isToday && (hasFutureEntries || hasPastEntries);

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
          <Heading
            as="h1"
            className={
              isToday ? `${styles.title} ${styles.titleToday}` : styles.title
            }
            data-testid="daily-notes-title">
            {formatDisplayDate(selectedDateKey)}
          </Heading>
          <button
            type="button"
            className={styles.downloadButton}
            onClick={handleDownload}
            aria-label="Download"
            title="Download"
            data-testid="daily-notes-download">
            <svg
              className={styles.downloadIcon}
              viewBox="0 0 24 24"
              width="18"
              height="18"
              aria-hidden="true"
              focusable="false">
              <path
                fill="currentColor"
                d="M12 3a1 1 0 0 1 1 1v9.59l2.3-2.3a1 1 0 1 1 1.4 1.42l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.42L11 13.59V4a1 1 0 0 1 1-1Zm-7 14a1 1 0 0 1 1 1v1h12v-1a1 1 0 1 1 2 0v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1Z"
              />
            </svg>
          </button>
        </div>
        <div className={styles.pickerRow}>
          <input
            id="daily-notes-date-picker"
            className={
              isToday
                ? `${styles.datePicker} ${styles.datePickerToday}`
                : styles.datePicker
            }
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
            aria-label="Add"
            title="Add"
            data-testid="daily-notes-add">
            <span className={styles.addIcon} aria-hidden="true">
              +
            </span>
          </button>
        </form>

        {!hasAnyTasks ? (
          <p className={styles.empty} data-testid="daily-notes-empty">
            No tasks for this day.
          </p>
        ) : showFuturePastBoard ? (
          <div className={styles.taskBoard} data-testid="daily-notes-list">
            {hasPastEntries ? (
              <DaySection
                label={PAST_SECTION_LABEL}
                testId="daily-notes-past"
                tasks={pastTasks}
                tone="past"
                onToggle={handleToggle}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onOpenDate={handleOpenDate}
              />
            ) : null}

            <div
              className={styles.todayBlock}
              data-testid="daily-notes-today">
              {hasTodayOpenTasks ? (
                <ul className={styles.taskList}>
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
              ) : (
                <p className={styles.todayEmpty}>No open tasks for today.</p>
              )}
            </div>

            {hasFutureEntries ? (
              <DaySection
                label={FUTURE_SECTION_LABEL}
                testId="daily-notes-future"
                tasks={futureTasks}
                tone="future"
                onToggle={handleToggle}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onOpenDate={handleOpenDate}
              />
            ) : null}
          </div>
        ) : (
          <ul className={styles.taskList} data-testid="daily-notes-list">
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

      {pastQuickNotes.length > 0 ? (
        <PastNotesSection notes={pastQuickNotes} onOpenDate={handleOpenDate} />
      ) : null}
    </div>
  );
}
