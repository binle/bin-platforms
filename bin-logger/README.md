# 1. Install

`npm install @bachle/bin-logger`

`yarn add @bachle/bin-logger`

# 2. Use:

```
  import { createLogger } from '@bachle/bin-logger';
  const logger = createLogger(options);
```

**options:**

| index | name          |                type                | description                         |
| :---- | :------------ | :--------------------------------: | :---------------------------------- |
| 1     | level         | ['error', 'info', 'warn', 'debug'] | level of logger                     |
| 2     | folderPath    |               string               | folder store the log file           |
| 3     | filename      |               string               | name of log file                    |
| 4     | maxFileSize   |               number               | number file will be store in folder |
| 5     | maxNumberFile |               number               | maximum file size of each file      |
