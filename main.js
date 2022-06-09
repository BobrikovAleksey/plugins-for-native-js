import { Select } from '/Select';
import '/styles.scss';

const exampleSelect = new Select('[data-select-plugin]', {
  items: [
    { id: 1, value: 'Option 1' },
    { id: 2, value: 'Option 2' },
    { id: 3, value: 'Option 3' },
    { id: 4, value: 'Option 4' },
    { id: 5, value: 'Option 5' },
    { id: 6, value: 'Option 6' },
  ],
});
