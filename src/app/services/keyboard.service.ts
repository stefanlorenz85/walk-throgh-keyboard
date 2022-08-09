import { Injectable } from '@angular/core';
import { last } from 'rxjs';
import { Key, KeyboardLayout, KeyPosition } from '../_model/keyboard';

// should be loaded by request from assets or other resource, otherwise it's in the js bundle
const LAYOUT_1 = [
  ['a', 'b', 'c', 'd', 'e'],
  ['f', 'g', 'h', 'i', 'j'],
  ['k', 'l', 'm', 'n', 'o'],
  ['p', 'q', 'r', 's', 't'],
  ['u', 'v', 'w', 'x', 'y'],
  ['z'],
];
const LAYOUT_LENGTH = LAYOUT_1[0].length;

export type Direction = 'D' | 'U' | 'R' | 'L' | 'X';

@Injectable({
  providedIn: 'root',
})
export class KeyboardService {
  // get the keyboard layout with positions of 2dim array
  public getLayoutWithPositions(): KeyboardLayout {
    const positionedLayout: KeyboardLayout = [];
    const layout = LAYOUT_1;

    for (let rowIndex = 0; rowIndex < layout.length; rowIndex++) {
      const layoutRow = layout[rowIndex];
      positionedLayout.push([]);

      for (let colIndex = 0; colIndex < layoutRow.length; colIndex++) {
        positionedLayout[rowIndex].push({
          label: layout[rowIndex][colIndex],
          row: rowIndex,
          col: colIndex,
        });
      }
    }
    return positionedLayout;
  }

  public findWayThroughPositions(word: string, layout: KeyboardLayout, startKey: Key): { keyPath: Direction[], keysToMoveOver: Key[] } {
    const findings = [startKey, ...this.findAllPositions(word, layout)];

    const result: { keyPath: Direction[], keysToMoveOver: Key[] } = { keyPath: [], keysToMoveOver: [] };

    for (var i = 0; i < findings.length; i++) {
      const currentEntry = findings[i];
      const nextEntry = findings[i + 1];

      if (!!nextEntry) {
        const steps: KeyPosition = {
          col: nextEntry.col - currentEntry.col,
          row: nextEntry.row - currentEntry.row,
        };

        // get keys to move up
        const wayToWalkRows = Math.abs(steps.row);
        for (let index = 0; index <= wayToWalkRows; index++) {
          result.keysToMoveOver.push(Math.sign(steps.row) === -1 ?
            layout[currentEntry.row - index][currentEntry.col] :
            layout[currentEntry.row + index][currentEntry.col]);
        }
        // get keys to move down
        const wayToWalkCols = Math.abs(steps.col);
        let lastKey: Key = result.keysToMoveOver[result.keysToMoveOver.length - 1]; // use at() with es2022
        for (let index = 1; index <= wayToWalkCols; index++) {
          result.keysToMoveOver.push(Math.sign(steps.row) === -1 ?
            layout[lastKey.row][lastKey.col - index] :
            layout[lastKey.row][lastKey.col + index]);
        }
        // TODO: some where is a still a bug and undefined values are in list
        result.keysToMoveOver = result.keysToMoveOver.filter(key => !!key);

        lastKey = result.keysToMoveOver[result.keysToMoveOver.length - 1]; // use at() with es2022
        lastKey.selected = true;
        // get key shortcuts directions e.g. "D", "U" etc.
        result.keyPath.push(
          ...new Array(wayToWalkRows).fill(Math.sign(steps.row) === -1 ? 'U' : 'D'),
          ...new Array(wayToWalkCols).fill(Math.sign(steps.col) === -1 ? 'L' : 'R'),
          'X',
        );
      }
    }
    return result;
  }

  private findAllPositions(word: string, layout: KeyboardLayout): Key[] {
    return word.split('').map(char => this.findKeyOnKeyboardLayout(layout, char));
  }

  private findKeyOnKeyboardLayout(layout: KeyboardLayout, label: string): Key {
    const index = layout.flat().findIndex(key => key.label === label);
    return {
      col: index % LAYOUT_LENGTH,
      row: Math.floor(index / LAYOUT_LENGTH),
      label,
      selected: true,
    };
  }
}
