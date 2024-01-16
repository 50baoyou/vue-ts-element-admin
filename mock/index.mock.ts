import path from 'node:path'
import { createDefineMock } from 'vite-plugin-mock-dev-server'

const definePostMock = createDefineMock((mock) => {
  mock.url = path.join(import.meta.env.VITE_APP_API, mock.url)
})

export default definePostMock
