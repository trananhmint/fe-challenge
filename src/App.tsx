import { useState } from "react";
import "./App.css";
import ProcessWithDelay from "./components/logical-test";
import TableUser from "./components/table";

function App() {
  const [test1, setTest1] = useState(true);


  return (
    <>
      <div>
        <button className="px-4 py-2  text-[#2c2c2c] border rounded hover:bg-[#2c2c2c] hover:text-white cursor-pointer" onClick={() => setTest1(!test1)}>
          {test1 ? "Logical Test" : "App Development Test"} 
        </button>
      </div>
      <div className="min-h-screen flex flex-col items-center justify-center">

        {
          test1 ? <ProcessWithDelay /> : <TableUser />
        }

      </div>
    </>
  );
}

export default App;
