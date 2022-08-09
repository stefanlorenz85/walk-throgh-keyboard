export interface Key extends KeyPosition {
  label: string;
  selected?: boolean;
}

export interface KeyPosition {
  row: number;
  col: number;
}

export type KeyboardRow = Key[];
export type KeyboardLayout = KeyboardRow[];
