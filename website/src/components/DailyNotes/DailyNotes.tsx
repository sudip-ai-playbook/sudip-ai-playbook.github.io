import type {ChangeEvent, FormEvent, ReactNode} from 'react';
import {useEffect, useState} from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';
import Heading from '@theme/Heading';

import styles from './DailyNotes.module.css';
import {
  createEmptyStore,
  createTask,
  formatDateKey,
  formatDisplayDate,
  getQuickNoteForDay,
  getTasksForDay,
  isValidDateKey,
  listDayKeys,
  loadDailyNotesStore,
  moveTaskToDate,
  saveDailyNotesStore,
  setQuickNoteForDay,
  setTasksForDay,
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

function getVisibleDayKeys(
  dayKeys: string[],
  todayKey: string,
  selectedDateKey: string,
): string[] {
  const uniqueKeys = new Set(dayKeys);
  uniqueKeys.add(todayKey);
  uniqueKeys.add(selectedDateKey);
  return Array.from(uniqueKeys).sort((left, right) =>
    right.localeCompare(left),
  );
}

type DayButtonProps = {
  dateKey: string;
  todayKey: string;
  isSelected: boolean;
  onSelectDay: (dateKey: string) => void;
};

function DayButton({
  dateKey,
  todayKey,
  isSelected,
  onSelectDay,
}: DayButtonProps): ReactNode {
  function handleClick(): void {
    onSelectDay(dateKey);
  }

  return (
    <button
      type="button"
      className={isSelected ? styles.dayButtonActive : styles.dayButton}
      onClick={handleClick}
      data-testid={`daily-notes-day-${dateKey}`}
      aria-pressed={isSelected}>
      {dateKey === todayKey ? 'Today' : dateKey}
    </button>
  );
}

type TaskItemProps = {
  task: DailyTask;
  selectedDateKey: string;
  onToggleTask: (taskId: string, done: boolean) => void;
  onDeleteTask: (taskId: string) => void;
  onMoveTask: (taskId: string, toDateKey: string) => void;
};

function TaskItem({
  task,
  selectedDateKey,
  onToggleTask,
  onDeleteTask,
  onMoveTask,
}: TaskItemProps): ReactNode {
  const [moveDate, setMoveDate] = useState('');

  function handleToggle(event: ChangeEvent<HTMLInputElement>): void {
    onToggleTask(task.id, event.target.checked);
  }

  function handleDelete(): void {
    onDeleteTask(task.id);
  }

  function handleMoveDateChange(event: ChangeEvent<HTMLInputElement>): void {
    setMoveDate(event.target.value);
  }

  function handleMoveSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (!isValidDateKey(moveDate) || moveDate === selectedDateKey) {
      return;
    }
    onMoveTask(task.id, moveDate);
    setMoveDate('');
  }

  return (
    <li className={styles.taskItem}>
      <div className={styles.taskMain}>
        <label className={styles.taskLabel}>
          <input
            type="checkbox"
            checked={task.done}
            onChange={handleToggle}
            data-testid={`daily-notes-checkbox-${task.id}`}
          />
          <span className={task.done ? styles.taskTextDone : styles.taskText}>
            {task.text}
          </span>
        </label>
        <button
          type="button"
          className={styles.deleteButton}
          onClick={handleDelete}
          aria-label={`Delete task ${task.text}`}
          data-testid={`daily-notes-delete-${task.id}`}>
          Delete
        </button>
      </div>
      <form
        className={styles.moveForm}
        onSubmit={handleMoveSubmit}
        data-testid={`daily-notes-move-form-${task.id}`}>
        <label
          className={styles.srOnly}
          htmlFor={`daily-notes-move-${task.id}`}>
          Move task to date
        </label>
        <input
          id={`daily-notes-move-${task.id}`}
          className={styles.moveInput}
          type="date"
          value={moveDate}
          onChange={handleMoveDateChange}
          data-testid={`daily-notes-move-date-${task.id}`}
        />
        <button
          type="submit"
          className={styles.moveButton}
          disabled={!isValidDateKey(moveDate) || moveDate === selectedDateKey}
          data-testid={`daily-notes-move-${task.id}`}>
          Move
        </button>
      </form>
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

  function handleSelectDay(dateKey: string): void {
    setSelectedDateKey(dateKey);
    setPickerDate(dateKey);
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
    const nextStore = setTasksForDay(store, selectedDateKey, [
      ...currentTasks,
      task,
    ]);
    persistStore(nextStore);
    setDraftText('');
  }

  function handleToggleTask(taskId: string, done: boolean): void {
    const currentTasks = getTasksForDay(store, selectedDateKey);
    const nextStore = setTasksForDay(
      store,
      selectedDateKey,
      updateTaskDone(currentTasks, taskId, done),
    );
    persistStore(nextStore);
  }

  function handleDeleteTask(taskId: string): void {
    const currentTasks = getTasksForDay(store, selectedDateKey);
    const nextStore = setTasksForDay(
      store,
      selectedDateKey,
      removeTask(currentTasks, taskId),
    );
    persistStore(nextStore);
  }

  function handleMoveTask(taskId: string, toDateKey: string): void {
    const nextStore = moveTaskToDate(
      store,
      selectedDateKey,
      toDateKey,
      taskId,
    );
    persistStore(nextStore);
  }

  function handleQuickNoteChange(event: ChangeEvent<HTMLTextAreaElement>): void {
    const nextStore = setQuickNoteForDay(
      store,
      selectedDateKey,
      event.target.value,
    );
    persistStore(nextStore);
  }

  function handleOpenToday(): void {
    setSelectedDateKey(todayKey);
    setPickerDate(todayKey);
  }

  const tasks = getTasksForDay(store, selectedDateKey);
  const quickNote = getQuickNoteForDay(store, selectedDateKey);
  const visibleDayKeys = getVisibleDayKeys(
    listDayKeys(store),
    todayKey,
    selectedDateKey,
  );

  if (!hasHydrated) {
    return (
      <div className={styles.root} data-testid="daily-notes-loading">
        <p className={styles.loading}>Loading notes…</p>
      </div>
    );
  }

  return (
    <div className={styles.root} data-testid="daily-notes">
      <header className={styles.header}>
        <p className={styles.eyebrow}>Daily Notes</p>
        <Heading as="h1" className={styles.title}>
          {formatDisplayDate(selectedDateKey)}
        </Heading>
      </header>

      <section className={styles.daySwitcher} aria-label="Choose day">
        <div className={styles.pickerRow}>
          <label className={styles.pickerLabel} htmlFor="daily-notes-date-picker">
            Open date
          </label>
          <input
            id="daily-notes-date-picker"
            className={styles.datePicker}
            type="date"
            value={pickerDate}
            onChange={handlePickerChange}
            data-testid="daily-notes-date-picker"
          />
          {selectedDateKey !== todayKey ? (
            <button
              type="button"
              className={styles.todayLink}
              onClick={handleOpenToday}
              data-testid="daily-notes-open-today">
              Back to today
            </button>
          ) : null}
        </div>
        <div className={styles.dayList} data-testid="daily-notes-days">
          {visibleDayKeys.map((dateKey) => (
            <DayButton
              key={dateKey}
              dateKey={dateKey}
              todayKey={todayKey}
              isSelected={dateKey === selectedDateKey}
              onSelectDay={handleSelectDay}
            />
          ))}
        </div>
      </section>

      <section className={styles.tasksSection} aria-labelledby="daily-notes-tasks">
        <Heading as="h2" id="daily-notes-tasks" className={styles.tasksHeading}>
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
            placeholder="Add a task for this day"
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

        {tasks.length === 0 ? (
          <p className={styles.empty} data-testid="daily-notes-empty">
            No tasks yet for this day.
          </p>
        ) : (
          <ul className={styles.taskList} data-testid="daily-notes-list">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                selectedDateKey={selectedDateKey}
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
                onMoveTask={handleMoveTask}
              />
            ))}
          </ul>
        )}
      </section>

      <section
        className={styles.notesSection}
        aria-labelledby="daily-notes-quick-notes">
        <Heading
          as="h2"
          id="daily-notes-quick-notes"
          className={styles.tasksHeading}>
          Quick notes
        </Heading>
        <label className={styles.srOnly} htmlFor="daily-notes-quick-note">
          Quick notes for this day
        </label>
        <textarea
          id="daily-notes-quick-note"
          className={styles.textarea}
          value={quickNote}
          onChange={handleQuickNoteChange}
          placeholder="Scratch notes for this day…"
          rows={6}
          data-testid="daily-notes-quick-note"
        />
      </section>
    </div>
  );
}
