/* eslint-disable no-console */
import fs from 'fs'
import 'dotenv/config'

const {
  MONGODB_SERVER_USERNAME,
  MONGODB_SERVER_PASSWORD,
  MONGODB_SERVER_HOST,
  MONGODB_SERVER_APP_NAME,
} = process.env

// https://www.mongodb.com/developer/languages/typescript/type-safety-with-prisma-and-mongodb/
const databaseUrl = `mongodb+srv://${MONGODB_SERVER_USERNAME}:${MONGODB_SERVER_PASSWORD}@${MONGODB_SERVER_HOST}/prisma?retryWrites=true&w=majority&appName=${MONGODB_SERVER_APP_NAME}`

const writeToEnv = async () => {
  let errorMessages = ''

  if (!MONGODB_SERVER_USERNAME) {
    errorMessages = '\tMONGODB_SERVER_USERNAME is missing.\n'
  }
  if (!MONGODB_SERVER_PASSWORD) {
    errorMessages += '\tMONGODB_SERVER_PASSWORD is missing.\n'
  }
  if (!MONGODB_SERVER_HOST) {
    errorMessages += '\tMONGODB_SERVER_HOST is missing.\n'
  }
  if (!MONGODB_SERVER_APP_NAME) {
    errorMessages += '\tMONGODB_SERVER_APP_NAME is missing.\n'
  }

  if (errorMessages) {
    console.error(
      'Error(s):\n',
      errorMessages,
      '\nFAILURE: Cannot write .env file.'
    )
  } else {
    fs.writeFileSync('.env', `DATABASE_URL=${databaseUrl}\n`, {
      flag: 'w',
    })
    console.log('SUCCESS: .env file successfully updated.')
  }
}

writeToEnv()
