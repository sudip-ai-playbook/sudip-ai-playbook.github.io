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
  getTasksForDay,
  listDayKeys,
  loadDailyNotesStore,
  saveDailyNotesStore,
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
  onToggleTask: (taskId: string, done: boolean) => void;
  onDeleteTask: (taskId: string) => void;
};

function TaskItem({
  task,
  onToggleTask,
  onDeleteTask,
}: TaskItemProps): ReactNode {
  function handleToggle(event: ChangeEvent<HTMLInputElement>): void {
    onToggleTask(task.id, event.target.checked);
  }

  function handleDelete(): void {
    onDeleteTask(task.id);
  }

  return (
    <li className={styles.taskItem}>
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
    </li>
  );
}

export default function DailyNotes(): ReactNode {
  const isBrowser = useIsBrowser();
  const todayKey = formatDateKey(new Date());
  const [selectedDateKey, setSelectedDateKey] = useState(todayKey);
  const [store, setStore] = useState<DailyNotesStore>(createEmptyStore);
  const [draftText, setDraftText] = useState('');
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

  function handleOpenToday(): void {
    setSelectedDateKey(todayKey);
  }

  const tasks = getTasksForDay(store, selectedDateKey);
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
        <p className={styles.disclaimer}>
          Stored only in this browser. Clearing site data deletes your notes.
        </p>
      </header>

      <section className={styles.daySwitcher} aria-label="Saved days">
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
        {selectedDateKey !== todayKey ? (
          <button
            type="button"
            className={styles.todayLink}
            onClick={handleOpenToday}
            data-testid="daily-notes-open-today">
            Back to today
          </button>
        ) : null}
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
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
