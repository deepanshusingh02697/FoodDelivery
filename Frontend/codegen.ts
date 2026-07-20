import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,

  schema: "http://localhost:3001/graphql",

  generates: {
    "src/generated/schema-types.ts": {
      plugins: [
        "typescript"
      ],
      config: {
        enumsAsTypes: true
      }
    }
  }
};

export default config;