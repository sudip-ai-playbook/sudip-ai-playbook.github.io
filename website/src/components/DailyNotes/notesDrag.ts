import type {DragEvent} from 'react';

import {
  parseTaskDragPayload,
  serializeTaskDragPayload,
  TASK_DRAG_MIME,
  type TaskDragPayload,
} from './notesStorage';

export function writeTaskDragPayload(
  event: DragEvent,
  payload: TaskDragPayload,
): void {
  const serialized = serializeTaskDragPayload(payload);
  event.dataTransfer.setData(TASK_DRAG_MIME, serialized);
  event.dataTransfer.setData('text/plain', serialized);
  event.dataTransfer.effectAllowed = 'move';
}

export function readTaskDragPayload(
  event: DragEvent,
): TaskDragPayload | null {
  const custom = event.dataTransfer.getData(TASK_DRAG_MIME);
  if (custom) {
    return parseTaskDragPayload(custom);
  }
  return parseTaskDragPayload(event.dataTransfer.getData('text/plain'));
}

export function allowTaskDrop(event: DragEvent): void {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
}

/** Resolves the task id to insert before from a drop target, or null for end-of-list. */
export function resolveDropBeforeTaskId(
  target: EventTarget | null,
): string | null {
  if (!(target instanceof Element)) {
    return null;
  }
  const taskElement = target.closest('[data-task-id]');
  if (!(taskElement instanceof HTMLElement)) {
    return null;
  }
  const taskId = taskElement.dataset.taskId;
  if (typeof taskId !== 'string' || taskId.length === 0) {
    return null;
  }
  return taskId;
}
