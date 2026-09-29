import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { pl } from '@payloadcms/translations/languages/pl'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Brands } from './collections/Brands'
import { Categories } from './collections/Categories'
import { Products } from './collections/Products'
import { Orders } from './collections/Orders'
import { Applications } from './collections/Applications'
import { Messages } from './collections/Messages'
import { Settings } from './globals/Settings'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const hosts = ['https://davi.programo.pl', 'http://localhost:3013']

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: ' · DAVI B2B' },
    components: { graphics: { Logo: '@/components/admin/Logo', Icon: '@/components/admin/Icon' } },
  },
  i18n: { supportedLanguages: { pl }, fallbackLanguage: 'pl' },
  collections: [Products, Brands, Categories, Orders, Applications, Messages, Media, Users],
  globals: [Settings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'dev-secret',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: sqliteAdapter({
    client: { url: process.env.DATABASE_URI || 'file:./payload.db' },
    migrationDir: path.resolve(dirname, 'migrations'),
    push: false,
  }),
  sharp,
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
  cors: hosts,
  csrf: hosts,
})
