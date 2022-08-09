import { Component, Input } from '@angular/core';

@Component({
  selector: 'key',
  templateUrl: './key.component.html',
  styleUrls: ['./hey.component.scss'],
})
export class KeyComponent {
  @Input() label: string;
}
