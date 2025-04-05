
import './App.css'
import TableUser from './components/table'

function App() {

  return (
    <>
      <div className='min-h-screen flex flex-col items-center justify-center'>
        <div className='w-full max-w-4xl rounded-lg shadow-lg p-5'>
          <TableUser />
        </div>
      </div>
    </>
  )
}

export default App
