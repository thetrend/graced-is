/* eslint-disable import/no-extraneous-dependencies */
import { CodegenConfig } from '@graphql-codegen/cli'
import 'dotenv/config'

const config: CodegenConfig = {
  schema:
    'https://api-us-east-1-shared-usea1-02.hygraph.com/v2/cltjk1nqp0fco07w0dndbjxqp/master',
  documents: ['src/**/*.{ts,tsx}'],
  generates: {
    './src/gql/generated/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
      },
    },
  },
  ignoreNoDocuments: true,
}

export default config
