import logo from './logo.svg';
import * as XLSX from 'xlsx'
import { useState } from 'react';
import {useForm} from 'react-hook-form'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import './App.css';

function App() {
    const [data, setData] = useState([]);
    const [date, setDate] = useState(new Date())
    const [criteria, setCriteria] = useState({})

    const {register, handleSubmit, watch} = useForm()
    const selectedDegree = watch('selectedDegree')

    const changeCriteria = (data) => {
      console.log(data)
      setCriteria(data)
      return criteria
    }

    const setDateToDisplay = () => {
      let selectedDate = criteria.selectedDate
      return selectedDate.toString()
    }

    const eventsForSelectedDate = (date) => {
      if (data["0"].date === date) {
        return data;
      }
      return null;
    }

    const convertExcelTimestamp = (timestamp) => {
      const baseDate = new Date(1900, 0, 0)
      const days = Math.floor(timestamp - 1)
      //const seconds = (timestamp - days) * 86400
      return new Date(baseDate.getTime() + (days * 86400) * 1000).toLocaleDateString('en-CA')
    }
  
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
  
          //setData(jsonData.filter((a, index) => jsonData[index] && index <= 178 && index >= 4));
          console.log(jsonData.filter((a, index) => jsonData[index] && index <= 178 && index >= 4))
          console.log(dataParser(jsonData.filter((a, index) => jsonData[index] && index <= 178 && index >= 4)))
          setData(dataParser(jsonData.filter((a, index) => jsonData[index] && index <= 178 && index >= 4)))
        } catch (error) {
          console.error('Błąd parsowania pliku:', error);
        }
      };
  
      reader.onerror = (error) => {
        console.error('Błąd odczytu pliku:', error);
      };
  
      reader.readAsBinaryString(file);
    };

    const dataParser = (data) => {
      //let clearData = data.splice(158,1)
      let clearData = data.filter((obj, index) =>
          !Object.values(obj).some(value => 
            String(value).includes("BRAK ZAJĘĆ"))
        );

      
      
      const groups = []
      for(let i=0; i<clearData.length; i+=5) {
        let temp = {}
        temp['0'] = {
          'date': clearData[i]['__EMPTY_1'],
          'day': convertExcelTimestamp(clearData[i+1]['__EMPTY']),
        }
        for(let j=1; j<=4; j++) {
          temp[`${clearData[i+j]['__EMPTY_1']}`] = {
            '11': clearData[i+j]['__EMPTY_3'] || null,
            '12': clearData[i+j]['__EMPTY_5'] || null,
            '13': clearData[i+j]['__EMPTY_7'] || null,
            '21': clearData[i+j]['__EMPTY_8'] || null,
            '22': clearData[i+j]['__EMPTY_10'] || null,
            '31': clearData[i+j]['__EMPTY_12'] || null,
            '32': clearData[i+j]['__EMPTY_14'] || null,
            '41': clearData[i+j]['__EMPTY_16'] || null,
            '42': clearData[i+j]['__EMPTY_18'] || null,
            'DS1_sem1': clearData[i+j]['__EMPTY_22'] || null,
            'DS2_sem1': clearData[i+j]['__EMPTY_23'] || null,
            'CY1_sem1': clearData[i+j]['__EMPTY_24'] || null,
            'CY2_sem1': clearData[i+j]['__EMPTY_25'] || null,
            'CY3_sem1': clearData[i+j]['__EMPTY_26'] || null,
            'CY1_sem3': clearData[i+j]['__EMPTY_27'] || null,
            'CY2_sem3': clearData[i+j]['__EMPTY_28'] || null,
            'CY3_sem3': clearData[i+j]['__EMPTY_29'] || null,
            'DS1_sem3': clearData[i+j]['__EMPTY_30'] || null,
          }
        }
        groups.push(temp)
      }
      
      return groups.filter((a,index) => index <= 30)
    }


  return (
    <div className="App">
      <input type='file' onChange={handleFileChange}/>
      <form onSubmit={handleSubmit(changeCriteria)}>
        <label>Wybierz stopień studiów</label>
        <select {...register('selectedDegree')}>
          <option value="1">I stopnia</option>
          <option value="2">II stopnia</option>
        </select>
        {(selectedDegree && selectedDegree == "2") && <div>
            <label>Wybierz specjalizację</label>
            <select {...register('selectedSpecialization')}>
              <option value="cybsec">Cyberbezpieczeństwo</option>
              <option value="ds">Data Science</option>
            </select>
            <br/>
            <label>Wybierz semestr</label>
            <select {...register('selectedTerm')}>
              <option value="sem1">Pierwszy</option>
              <option value="sem3">Trzeci</option>
            </select>
            <br/>
            <label>Wybierz grupę</label>
            <select {...register('selectedGroup')}>
              <option value="CY1">CY1</option>
              <option value="CY2">CY2</option>
              <option value="CY3">CY3</option>
              <option value="DS1">DS1</option>
              <option value="DS2">DS2</option>
            </select>
          </div>
        }
        {(selectedDegree && selectedDegree == "1") && <div>
            <label>Wybierz semestr</label>
            <select {...register('selectedTerm')}>
              <option value="sem1">Pierwszy</option>
              <option value="sem3">Trzeci</option>
              <option value="sem5">Piąty</option>
              <option value="sem7">Siódmy</option>
            </select>
            <br/>
            <label>Wybierz grupę</label>
            <select {...register('selectedGroup')}>
              <option value="11">11</option>
              <option value="12">12</option>
              <option value="13">13</option>
              <option value="21">21</option>
              <option value="22">22</option>
              <option value="31">31</option>
              <option value="32">32</option>
              <option value="41">41</option>
              <option value="42">42</option>
            </select>
          </div>
        }
        <input type="submit" value="Submit"/>
      </form>
      {/*(criteria && data) && 
          <Calendar 
            onChange={setDate} 
            value={date}
            tileContent={({ date, view }) => {
              if (view === "month") {
                const eventsOnDate = eventsForSelectedDate(date);
                if (eventsOnDate) {
                  return (
                    <div style={{ fontSize: "10px", color: "blue" }}>
                      {Object.keys(eventsOnDate)
                        .filter((key) => key !== "0") // filtrujemy obiekt "0"
                        .map((timeSlot, index) => (
                          <div key={index}>
                            {timeSlot}: {Object.entries(eventsOnDate[timeSlot]).map(([group, event], idx) => (
                              <div key={idx}>
                                {group}: {event}
                              </div>
                            ))}
                          </div>
                        ))}
                    </div>
                  );
                }
              }
            }}
          />
      */}
    </div>
  );
}

export default App;
