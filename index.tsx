import { createRoot } from 'react-dom/client'

import { Demo } from './demo.js'

const root = createRoot(document.querySelector('main')!)

root.render(<Demo />)
