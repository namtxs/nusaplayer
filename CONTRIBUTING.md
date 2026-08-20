# Contributing

This project uses [pnpm](https://pnpm.io/). Install it first:

```bash
npm i -g pnpm
```

```bash
pnpm i
```

## Development

1. Create a branch.

   ```bash
   git checkout -b feat-add-something
   ```

2. Start the demo.

   ```bash
   pnpm run build
   pnpm --filter=@nusaplayer/<package_name> run start
   pnpm run dev:exam
   ```

   Standalone: http://localhost:5173/

   Docs (after `pnpm run build`):

   ```bash
   pnpm --filter=@nusaplayer/docs start
   ```

   http://localhost:3000/  ·  Playground: http://localhost:3000/playground/

3. Make changes, add tests if needed, then commit.
