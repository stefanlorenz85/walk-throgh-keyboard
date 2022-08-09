import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of, range, Subject, timer, take, map, tap, EMPTY } from 'rxjs';
import { Direction, KeyboardService } from '../services/keyboard.service';
import { Key, KeyboardLayout, KeyPosition } from '../_model/keyboard';

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.scss'],
})
export class KeyboardComponent implements OnInit {
  layout: KeyboardLayout = [];
  word = 'minuten';
  startKey: Key | undefined = undefined;

  way: { keyPath: Direction[]; keysToMoveOver: Key[] } | undefined;
  currentKey$: Observable<Key> = of({} as any);

  constructor (private keyboardService: KeyboardService) { }

  ngOnInit(): void {
    this.layout = this.keyboardService.getLayoutWithPositions();
    this.startKey = this.layout[0][0];
  }

  startWalk() {
    this.way = undefined;
    this.currentKey$ = of({} as any);;

    if (!this.startKey) {
      console.warn('Please select a startkey');
      return;
    }
    this.way = this.keyboardService.findWayThroughPositions(this.word, this.layout, this.startKey);

    const step = 0;
    this.currentKey$ = timer(0, 400).pipe(
      take(this.way.keyPath.length),
      map((index) => this.way?.keysToMoveOver[index] ?? {} as any),
    );
  }

  setStartPosition(key: Key) {
    this.startKey = key;
  }
}
