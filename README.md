# @letskomplai/gated

A simple, functional feature flagging library for Node.js. It is designed to solve the 80% use case of having feature toggles on Subjects (users, teams etc). While there are many feature flagging platforms, they are overkill + add complexity of deploying a separate service. Gated is a simple, light-weight alternative that can be used to manage feature flags in your application, saving data in your DB.

## Installation

```bash
npm install @letskomplai/gated
# or
yarn add @letskomplai/gated
# or
pnpm add @letskomplai/gated
```

## Usage

### Configuration

First, configure the library with a data adapter. Gated provides a simple in-memory adapter and a Prisma adapter out of the box.

```typescript
import { configure, MemoryAdapter } from '@letskomplai/gated';

configure({
  adapter: new MemoryAdapter(),
});
```

### Creating a Flag

```typescript
import { createFlag } from '@letskomplai/gated';

await createFlag({
  key: 'new-feature',
  description: 'Enable the new experimental feature',
});
```

### Checking for Access

Check if a feature is enabled for a specific subject (e.g., a user).

```typescript
import { isEnabled } from '@letskomplai/gated';

const subject = { id: 'user-123', attributes: { company: 'acme' } };

if (await isEnabled('new-feature', subject)) {
  // Show the new feature
} else {
  // Show the old feature
}
```

### Granting and Revoking Access

You can grant and revoke access to features for specific subjects.

```typescript
import { grantAccess, revokeAccess } from '@letskomplai/gated';

const subject = { id: 'user-123' };

// Grant access
await grantAccess('new-feature', subject);

// Revoke access
await revokeAccess('new-feature', subject);
```

## Adapters

- **`MemoryAdapter`**: A simple in-memory adapter for testing and development. Data is not persisted.
- **`PrismaAdapter`**: An adapter for using a Prisma-compatible database as a backend. To use it, you need to add the required models to your `schema.prisma` file.

  **1. Update your `schema.prisma`**

  Copy the models from the `prisma/schema.prisma` file in this repository into your own `prisma/schema.prisma` file. You can find the file [here](./prisma/schema.prisma).

  **2. Run Prisma migrations**

  After updating your schema, run the migrate command to update your database:

  ```bash
  npx prisma migrate dev --name add_gated_models
  ```

  **3. Configure Gated with the PrismaAdapter**

  Finally, instantiate the `PrismaAdapter` with your Prisma client and pass it to the `configure` function.

  ```typescript
  import { configure, PrismaAdapter } from '@letskomplai/gated';
  import { PrismaClient } from '@prisma/client';

  const prisma = new PrismaClient();

  configure({
    adapter: new PrismaAdapter(prisma),
  });
  ```

## Development

- **Build**: `npm run build`
- **Run tests**: `npm test`
- **Lint**: `npm run lint`
- **Format**: `npm run format`

