/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_HYGRAPH_API: string
  readonly VITE_GA_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
