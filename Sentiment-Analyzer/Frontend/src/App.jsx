import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import RouterConfig from './routes'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const [darkMode, setDarkMode] = useState(true)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  const themeClass = useMemo(
    () => (darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'),
    [darkMode]
  )

  return (
    <div className={`${themeClass} min-h-screen transition-colors duration-500`}>
      <BrowserRouter>
        <RouterConfig darkMode={darkMode} toggleDarkMode={() => setDarkMode((prev) => !prev)} />
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  )
}

export default App
