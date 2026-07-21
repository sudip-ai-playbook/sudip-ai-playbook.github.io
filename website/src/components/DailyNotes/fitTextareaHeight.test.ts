import assert from 'node:assert/strict';
import {describe, it} from 'node:test';

import {fitTextareaHeight} from './fitTextareaHeight.ts';

describe('fitTextareaHeight', () => {
  it('grows to scrollHeight when content is taller than the minimum', () => {
    const textarea = {
      scrollHeight: 240,
      style: {height: '8rem'},
    };

    fitTextareaHeight(textarea, 128);

    assert.equal(textarea.style.height, '240px');
  });

  it('keeps the minimum height when content is shorter', () => {
    const textarea = {
      scrollHeight: 64,
      style: {height: '200px'},
    };

    fitTextareaHeight(textarea, 128);

    assert.equal(textarea.style.height, '128px');
  });

  it('resets height to auto before measuring so the box can shrink', () => {
    const heights: string[] = [];
    const textarea = {
      scrollHeight: 96,
      style: {
        get height(): string {
          return heights[heights.length - 1] ?? '';
        },
        set height(value: string) {
          heights.push(value);
        },
      },
    };

    fitTextareaHeight(textarea, 128);

    assert.deepEqual(heights, ['auto', '128px']);
  });

  it('treats non-finite minimum heights as zero', () => {
    const textarea = {
      scrollHeight: 80,
      style: {height: ''},
    };

    fitTextareaHeight(textarea, Number.NaN);

    assert.equal(textarea.style.height, '80px');
  });
});
