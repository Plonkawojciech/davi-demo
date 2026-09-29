import * as migration_20260929_194418_initial from './20260929_194418_initial';

export const migrations = [
  {
    up: migration_20260929_194418_initial.up,
    down: migration_20260929_194418_initial.down,
    name: '20260929_194418_initial'
  },
];
