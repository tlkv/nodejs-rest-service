# Home Library Service

## Downloading & running

```
git clone https://github.com/tlkv/nodejs2022Q2-service.git
```

```
cd nodejs2022Q2-service
```

```
git checkout logging
```

```
npm i
```

Make .env file from .env.example (if the former is not present)

---

## Running in docker:

```
npm run docker:compose
```

OR

```
npm run docker:compose:rebuild (full rebuild)
```

---

## Running in dev mode:

```
npm run start:dev
```

To run in this mode you need to have local database running and specify connection settings in .env file.

---

## Tests:

```
npm run test:auth
```

```
npm run test (without authorization)
```

---

## Image scan:

```
npm run docker:scan:app
```

```
npm run docker:scan:db
```

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```
