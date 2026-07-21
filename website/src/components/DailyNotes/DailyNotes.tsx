import type {
  ChangeEvent,
  DragEvent,
  FormEvent,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  SyntheticEvent,
} from 'react';
import {useEffect, useRef, useState} from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';
import Heading from '@theme/Heading';

import styles from './DailyNotes.module.css';
import {fitTextareaToContent} from './fitTextareaHeight';
import {
  allowTaskDrop,
  readTaskDragPayload,
  resolveDropBeforeTaskId,
  writeTaskDragPayload,
} from './notesDrag';
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
  isTaskPriority,
  isValidDateKey,
  listCompletedTasksByDate,
  listFutureIncompleteTasks,
  listPastIncompleteTasks,
  listPastQuickNotes,
  loadDailyNotesStore,
  moveTaskToDate,
  PAST_NOTES_SECTION_LABEL,
  PAST_SECTION_LABEL,
  reorderIncompleteTask,
  resolveDropDateKey,
  saveDailyNotesStore,
  setQuickNoteForDay,
  setTasksForDay,
  shouldExpandDaySection,
  TODAY_SECTION_LABEL,
  toggleTaskPriority,
  updateTaskText,
  type DailyNotesStore,
  type DailyTask,
  type IncompleteTaskRef,
  type PastQuickNoteRef,
  type TaskBoardSection,
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
  canDrag?: boolean;
  showPriority?: boolean;
  dropBeforeActive?: boolean;
  onToggle: (dateKey: string, taskId: string, done: boolean) => void;
  onEdit: (dateKey: string, taskId: string, text: string) => void;
  onDelete: (dateKey: string, taskId: string) => void;
  onTogglePriority?: (dateKey: string, taskId: string) => void;
  onOpenDate?: (dateKey: string) => void;
};

function PriorityFlagIcon(): ReactNode {
  return (
    <svg
      className={styles.priorityIcon}
      viewBox="0 0 12 12"
      width="11"
      height="11"
      aria-hidden="true"
      focusable="false">
      <path
        fill="currentColor"
        d="M2.5 1v10M2.5 1.25h6.2L7.1 3.6 8.7 6H2.5z"
      />
    </svg>
  );
}

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
  canDrag,
  showPriority,
  dropBeforeActive,
  onToggle,
  onEdit,
  onDelete,
  onTogglePriority,
  onOpenDate,
}: TaskRowProps): ReactNode {
  const isDraggable = canDrag === true;
  const canShowPriority = showPriority === true && onTogglePriority !== undefined;
  const isPriority = isTaskPriority(task);
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

  function handlePriorityClick(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    event.stopPropagation();
    onTogglePriority?.(dateKey, task.id);
  }

  function handleOpenDate(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    event.stopPropagation();
    onOpenDate?.(dateKey);
  }

  function handleDragStart(event: DragEvent<HTMLLIElement>): void {
    writeTaskDragPayload(event, {
      taskId: task.id,
      fromDateKey: dateKey,
    });
    event.currentTarget.classList.add(styles.taskDragging);
  }

  function handleDragEnd(event: DragEvent<HTMLLIElement>): void {
    event.currentTarget.classList.remove(styles.taskDragging);
  }

  const isDated = dateTag !== undefined;
  const itemClassName = [
    isDated
      ? tone === 'future'
        ? styles.futureItem
        : styles.pastItem
      : styles.taskItem,
    dropBeforeActive === true ? styles.taskDropBefore : '',
  ]
    .filter((className) => className.length > 0)
    .join(' ');

  return (
    <li
      className={itemClassName}
      draggable={isDraggable}
      data-task-id={task.id}
      onDragStart={isDraggable ? handleDragStart : undefined}
      onDragEnd={isDraggable ? handleDragEnd : undefined}
      data-testid={
        isDated
          ? `daily-notes-open-${task.id}`
          : `daily-notes-task-${task.id}`
      }>
      <div className={styles.taskMain}>
        {isDraggable ? (
          <span
            className={styles.dragHandle}
            aria-hidden="true"
            data-testid={`daily-notes-drag-${task.id}`}>
            ⋮⋮
          </span>
        ) : null}
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
        {canShowPriority ? (
          <button
            type="button"
            className={
              isPriority
                ? `${styles.priorityButton} ${styles.priorityButtonActive}`
                : styles.priorityButton
            }
            onClick={handlePriorityClick}
            aria-label={
              isPriority ? 'Remove high priority' : 'Mark high priority'
            }
            aria-pressed={isPriority}
            title={isPriority ? 'High priority' : 'Priority'}
            data-testid={`daily-notes-priority-${task.id}`}>
            <PriorityFlagIcon />
          </button>
        ) : null}
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

type DropSectionProps = {
  section: TaskBoardSection;
  label: string;
  testId: string;
  taskCount: number;
  isActive: boolean;
  collapsible?: boolean;
  children: ReactNode;
  onDragActiveChange: (section: TaskBoardSection | null) => void;
  onDropEvent: (
    section: TaskBoardSection,
    event: DragEvent<HTMLElement>,
  ) => void;
};

function DropSection({
  section,
  label,
  testId,
  taskCount,
  isActive,
  collapsible,
  children,
  onDragActiveChange,
  onDropEvent,
}: DropSectionProps): ReactNode {
  const isCollapsible = collapsible === true;
  const [isOpen, setIsOpen] = useState(() =>
    shouldExpandDaySection(taskCount),
  );

  function handleSectionToggle(
    event: SyntheticEvent<HTMLDetailsElement>,
  ): void {
    setIsOpen(event.currentTarget.open);
  }

  function handleDragOver(event: DragEvent<HTMLElement>): void {
    allowTaskDrop(event);
    onDragActiveChange(section);
  }

  function handleDragLeave(event: DragEvent<HTMLElement>): void {
    const nextTarget = event.relatedTarget;
    if (
      nextTarget instanceof Node &&
      event.currentTarget.contains(nextTarget)
    ) {
      return;
    }
    onDragActiveChange(null);
  }

  function handleDrop(event: DragEvent<HTMLElement>): void {
    onDropEvent(section, event);
  }

  const dropClassName = isActive
    ? `${styles.dropSection} ${styles.dropSectionActive}`
    : styles.dropSection;

  if (!isCollapsible) {
    return (
      <div
        className={`${styles.todayBlock} ${dropClassName}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        data-testid={testId}>
        <p className={styles.todayLabel}>
          {label} ({taskCount})
        </p>
        {children}
      </div>
    );
  }

  return (
    <details
      className={`${styles.daySection} ${dropClassName}`}
      open={isOpen || isActive}
      onToggle={handleSectionToggle}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-testid={testId}>
      <summary className={styles.daySectionSummary}>
        {label} ({taskCount})
      </summary>
      {children}
    </details>
  );
}

type DaySectionListProps = {
  tasks: IncompleteTaskRef[];
  tone: TaskTone;
  listTestId: string;
  emptyLabel: string;
  onToggle: (dateKey: string, taskId: string, done: boolean) => void;
  onEdit: (dateKey: string, taskId: string, text: string) => void;
  onDelete: (dateKey: string, taskId: string) => void;
  onTogglePriority: (dateKey: string, taskId: string) => void;
  onOpenDate: (dateKey: string) => void;
};

function DaySectionList({
  tasks,
  tone,
  listTestId,
  emptyLabel,
  onToggle,
  onEdit,
  onDelete,
  onTogglePriority,
  onOpenDate,
}: DaySectionListProps): ReactNode {
  if (tasks.length === 0) {
    return (
      <p className={styles.sectionEmpty} data-testid={`${listTestId}-empty`}>
        {emptyLabel}
      </p>
    );
  }

  return (
    <ul className={styles.taskList} data-testid={listTestId}>
      {tasks.map((item) => (
        <TaskRow
          key={`${item.dateKey}-${item.task.id}`}
          task={item.task}
          dateKey={item.dateKey}
          dateTag={formatShortDate(item.dateKey)}
          tone={tone}
          canDrag
          showPriority
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          onTogglePriority={onTogglePriority}
          onOpenDate={onOpenDate}
        />
      ))}
    </ul>
  );
}

type TaskBoardProps = {
  pastTasks: IncompleteTaskRef[];
  openTasks: DailyTask[];
  futureTasks: IncompleteTaskRef[];
  selectedDateKey: string;
  todayKey: string;
  store: DailyNotesStore;
  activeDropSection: TaskBoardSection | null;
  dropBeforeTaskId: string | null;
  onActiveDropSectionChange: (section: TaskBoardSection | null) => void;
  onDropBeforeTaskIdChange: (taskId: string | null) => void;
  onPersist: (store: DailyNotesStore) => void;
  onToggle: (dateKey: string, taskId: string, done: boolean) => void;
  onEdit: (dateKey: string, taskId: string, text: string) => void;
  onDelete: (dateKey: string, taskId: string) => void;
  onTogglePriority: (dateKey: string, taskId: string) => void;
  onOpenDate: (dateKey: string) => void;
};

function TaskBoard({
  pastTasks,
  openTasks,
  futureTasks,
  selectedDateKey,
  todayKey,
  store,
  activeDropSection,
  dropBeforeTaskId,
  onActiveDropSectionChange,
  onDropBeforeTaskIdChange,
  onPersist,
  onToggle,
  onEdit,
  onDelete,
  onTogglePriority,
  onOpenDate,
}: TaskBoardProps): ReactNode {
  function clearDropIndicators(): void {
    onActiveDropSectionChange(null);
    onDropBeforeTaskIdChange(null);
  }

  function applyDrop(
    section: TaskBoardSection,
    event: DragEvent<HTMLElement>,
  ): void {
    event.preventDefault();
    const payload = readTaskDragPayload(event);
    const beforeTaskId = resolveDropBeforeTaskId(event.target);
    clearDropIndicators();
    if (!payload) {
      return;
    }

    if (section === 'today') {
      let nextStore = store;
      if (payload.fromDateKey !== todayKey) {
        nextStore = moveTaskToDate(
          nextStore,
          payload.fromDateKey,
          todayKey,
          payload.taskId,
        );
      }
      if (beforeTaskId === payload.taskId) {
        onPersist(nextStore);
        return;
      }
      if (payload.fromDateKey === todayKey || beforeTaskId !== null) {
        nextStore = reorderIncompleteTask(
          nextStore,
          todayKey,
          payload.taskId,
          beforeTaskId,
        );
      }
      onPersist(nextStore);
      return;
    }

    const toDateKey = resolveDropDateKey(
      section,
      todayKey,
      payload.fromDateKey,
    );
    onPersist(
      moveTaskToDate(
        store,
        payload.fromDateKey,
        toDateKey,
        payload.taskId,
      ),
    );
  }

  function handleTodayDragOver(event: DragEvent<HTMLElement>): void {
    allowTaskDrop(event);
    onActiveDropSectionChange('today');
    onDropBeforeTaskIdChange(resolveDropBeforeTaskId(event.target));
  }

  function handleTodayDragLeave(event: DragEvent<HTMLElement>): void {
    const nextTarget = event.relatedTarget;
    if (
      nextTarget instanceof Node &&
      event.currentTarget.contains(nextTarget)
    ) {
      return;
    }
    clearDropIndicators();
  }

  return (
    <div className={styles.taskBoard} data-testid="daily-notes-list">
      <DropSection
        section="past"
        label={PAST_SECTION_LABEL}
        testId="daily-notes-past"
        taskCount={pastTasks.length}
        isActive={activeDropSection === 'past'}
        collapsible
        onDragActiveChange={onActiveDropSectionChange}
        onDropEvent={applyDrop}>
        <DaySectionList
          tasks={pastTasks}
          tone="past"
          listTestId="daily-notes-past-list"
          emptyLabel="Drop here"
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          onTogglePriority={onTogglePriority}
          onOpenDate={onOpenDate}
        />
      </DropSection>

      <div
        className={
          activeDropSection === 'today'
            ? `${styles.todayBlock} ${styles.dropSection} ${styles.dropSectionActive}`
            : `${styles.todayBlock} ${styles.dropSection}`
        }
        onDragOver={handleTodayDragOver}
        onDragLeave={handleTodayDragLeave}
        onDrop={(event) => {
          applyDrop('today', event);
        }}
        data-testid="daily-notes-today">
        <p className={styles.todayLabel}>
          {TODAY_SECTION_LABEL} ({openTasks.length})
        </p>
        {openTasks.length > 0 ? (
          <ul className={styles.taskList}>
            {openTasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                dateKey={selectedDateKey}
                canDrag
                showPriority
                dropBeforeActive={dropBeforeTaskId === task.id}
                onToggle={onToggle}
                onEdit={onEdit}
                onDelete={onDelete}
                onTogglePriority={onTogglePriority}
              />
            ))}
          </ul>
        ) : (
          <p className={styles.todayEmpty} data-testid="daily-notes-today-empty">
            Drop here
          </p>
        )}
      </div>

      <DropSection
        section="future"
        label={FUTURE_SECTION_LABEL}
        testId="daily-notes-future"
        taskCount={futureTasks.length}
        isActive={activeDropSection === 'future'}
        collapsible
        onDragActiveChange={onActiveDropSectionChange}
        onDropEvent={applyDrop}>
        <DaySectionList
          tasks={futureTasks}
          tone="future"
          listTestId="daily-notes-future-list"
          emptyLabel="Drop here"
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          onTogglePriority={onTogglePriority}
          onOpenDate={onOpenDate}
        />
      </DropSection>
    </div>
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
  const [activeDropSection, setActiveDropSection] =
    useState<TaskBoardSection | null>(null);
  const [dropBeforeTaskId, setDropBeforeTaskId] = useState<string | null>(
    null,
  );
  const quickNoteTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const quickNote = getQuickNoteForDay(store, selectedDateKey);

  useEffect(() => {
    if (!isBrowser) {
      return;
    }
    setStore(loadDailyNotesStore());
    setHasHydrated(true);
  }, [isBrowser]);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }
    const textarea = quickNoteTextareaRef.current;
    if (!textarea) {
      return;
    }
    fitTextareaToContent(textarea);
  }, [hasHydrated, quickNote, selectedDateKey]);

  useEffect(() => {
    if (!hasHydrated || !isBrowser) {
      return;
    }

    function handleWindowResize(): void {
      const textarea = quickNoteTextareaRef.current;
      if (!textarea) {
        return;
      }
      fitTextareaToContent(textarea);
    }

    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [hasHydrated, isBrowser]);

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

  function handleTogglePriority(dateKey: string, taskId: string): void {
    persistStore(toggleTaskPriority(store, dateKey, taskId));
  }

  function handleActiveDropSectionChange(
    section: TaskBoardSection | null,
  ): void {
    setActiveDropSection(section);
    if (section !== 'today') {
      setDropBeforeTaskId(null);
    }
  }

  function handleQuickNoteChange(event: ChangeEvent<HTMLTextAreaElement>): void {
    persistStore(
      setQuickNoteForDay(store, selectedDateKey, event.target.value),
    );
    fitTextareaToContent(event.currentTarget);
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
  const completedGroups = listCompletedTasksByDate(store);
  const completedCount = completedGroups.reduce(
    (total, group) => total + group.tasks.length,
    0,
  );
  const pastQuickNotes = listPastQuickNotes(store, todayKey);
  const hasTodayOpenTasks = openTasks.length > 0;
  const hasAnyTasks =
    futureTasks.length > 0 || hasTodayOpenTasks || pastTasks.length > 0;

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

        {!hasAnyTasks && !isToday ? (
          <p className={styles.empty} data-testid="daily-notes-empty">
            No tasks for this day.
          </p>
        ) : isToday ? (
          <TaskBoard
            pastTasks={pastTasks}
            openTasks={openTasks}
            futureTasks={futureTasks}
            selectedDateKey={selectedDateKey}
            todayKey={todayKey}
            store={store}
            activeDropSection={activeDropSection}
            dropBeforeTaskId={dropBeforeTaskId}
            onActiveDropSectionChange={handleActiveDropSectionChange}
            onDropBeforeTaskIdChange={setDropBeforeTaskId}
            onPersist={persistStore}
            onToggle={handleToggle}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onTogglePriority={handleTogglePriority}
            onOpenDate={handleOpenDate}
          />
        ) : (
          <ul className={styles.taskList} data-testid="daily-notes-list">
            {openTasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                dateKey={selectedDateKey}
                showPriority
                onToggle={handleToggle}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onTogglePriority={handleTogglePriority}
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
          ref={quickNoteTextareaRef}
          className={styles.textarea}
          value={quickNote}
          onChange={handleQuickNoteChange}
          placeholder="Notes…"
          rows={3}
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
