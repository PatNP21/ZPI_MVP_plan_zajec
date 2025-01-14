import logo from './logo.svg';
import * as XLSX from 'xlsx'
import { useState } from 'react';
import './App.css';

function App() {
    const [data, setData] = useState([]);
  
    const handleFileChange = (e) => {
      const file = e.target.files[0];
  
      if (!file) {
        console.error('Nie wybrano pliku.');
        return;
      }
  
      if (!file.type.match(/application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet|application\/vnd\.ms-excel/)) {
        console.error('Nieprawidłowy typ pliku. Wybierz plik Excel.');
        return;
      }
  
      const reader = new FileReader();
  
      reader.onload = (event) => {
        try {
          const binaryStr = event.target.result;
          const workbook = XLSX.read(binaryStr, { type: 'binary' });
  
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
  
          setData(jsonData);
          console.log(data)
        } catch (error) {
          console.error('Błąd parsowania pliku:', error);
        }
      };
  
      reader.onerror = (error) => {
        console.error('Błąd odczytu pliku:', error);
      };
  
      reader.readAsBinaryString(file);
    };


  return (
    <div className="App">
      <input type='file' onChange={handleFileChange}/>
      {data ? data.map(item => {
         return (<div>
            {JSON.stringify(item)}
          </div>)})
         : null}
    </div>
  );
}

export default App;
