import logo from './logo.svg';
import * as XLSX from 'xlsx'
import { useState } from 'react';
import {useForm} from 'react-hook-form'
import * as Calendar from 'react-calendar'
import moment from 'moment'
import './App.css';

function App() {
    const [data, setData] = useState([]);
    const [criteria, setCriteria] = useState({})

    const {register, handleSubmit, watch} = useForm()
    const selectedDegree = watch('selectedDegree')

    const changeCriteria = (data) => {
      console.log(data)
      setCriteria(data)
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
  
          setData(jsonData.filter((a, index) => jsonData[index] && index <= 178 && index >= 4));
          console.log(jsonData.filter((a, index) => jsonData[index] && index <= 178 && index >= 4))
          console.log(dataParser(jsonData.filter((a, index) => jsonData[index] && index <= 178 && index >= 4)))
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
      const groupsCount = data.length / 5
      const groups = []
      for(let i=0; i<data.length; i+=5) {
        let temp = {}
        temp['0'] = {
          'date': data[i]['__EMPTY_1'],
          'day': convertExcelTimestamp(data[i+1]['__EMPTY']),
        }
        for(let j=1; j<=4; j++) {
          temp[`${data[i+j]['__EMPTY_1']}`] = {
            '11': data[i+j]['__EMPTY_3'],
            '12': data[i+j]['__EMPTY_5'],
            '13': data[i+j]['__EMPTY_7'],
            '21': data[i+j]['__EMPTY_8'],
            '22': data[i+j]['__EMPTY_10'],
            '31': data[i+j]['__EMPTY_12'],
            '32': data[i+j]['__EMPTY_14'],
            '41': data[i+j]['__EMPTY_16'],
            '42': data[i+j]['__EMPTY_18'],
            'DS1_1': data[i+j]['__EMPTY_22'],
            'DS2_1': data[i+j]['__EMPTY_23'],
            'CY1_1': data[i+j]['__EMPTY_24'],
            'CY2_1': data[i+j]['__EMPTY_25'],
            'CY3_1': data[i+j]['__EMPTY_26'],
            'CY1_3': data[i+j]['__EMPTY_27'],
            'CY2_3': data[i+j]['__EMPTY_28'],
            'CY3_3': data[i+j]['__EMPTY_29'],
            'DS1_3': data[i+j]['__EMPTY_30'],
          }
        }
        groups.push(temp)
      }
      
      return groups
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
      {data ? data.map(item => {
         if(criteria && criteria['selectedDegree'] === '1' && criteria['selectedTerm'] === 'sem1' && criteria['selectedGroup'] === '11') {
          return (<div>
            {JSON.stringify(item["__EMPTY"]) && convertExcelTimestamp(Number(JSON.stringify(item["__EMPTY"])))}
            {JSON.stringify(item["__EMPTY_1"])}
            {JSON.stringify(item["__EMPTY_3"])}
          </div>)
         } else if(criteria && criteria['selectedDegree'] === '1' && criteria['selectedTerm'] === 'sem1' && criteria['selectedGroup'] === '12') {
          return (<div>
            {JSON.stringify(item["__EMPTY_1"])}
            {JSON.stringify(item["__EMPTY_5"])}
          </div>)
         } else if(criteria && criteria['selectedDegree'] === '1' && criteria['selectedTerm'] === 'sem1' && criteria['selectedGroup'] === '13') {
          return (<div>
            {JSON.stringify(item["__EMPTY_1"])}
            {JSON.stringify(item["__EMPTY_7"])}
          </div>)
         } else if(criteria && criteria['selectedDegree'] === '1' && criteria['selectedTerm'] === 'sem3' && criteria['selectedGroup'] === '21') {
          return (<div>
            {JSON.stringify(item["__EMPTY_1"])}
            {JSON.stringify(item["__EMPTY_8"])}
          </div>)
         } else if(criteria && criteria['selectedDegree'] === '1' && criteria['selectedTerm'] === 'sem3' && criteria['selectedGroup'] === '22') {
          return (<div>
            {JSON.stringify(item["__EMPTY_1"])}
            {JSON.stringify(item["__EMPTY_10"])}
          </div>)
         } else if(criteria && criteria['selectedDegree'] === '1' && criteria['selectedTerm'] === 'sem5' && criteria['selectedGroup'] === '31') {
          return (<div>
            {JSON.stringify(item["__EMPTY_1"])}
            {JSON.stringify(item["__EMPTY_12"])}
          </div>)
         } else if(criteria && criteria['selectedDegree'] === '1' && criteria['selectedTerm'] === 'sem5' && criteria['selectedGroup'] === '32') {
          return (<div>
            {JSON.stringify(item["__EMPTY_1"])}
            {JSON.stringify(item["__EMPTY_14"])}
          </div>)
         } else if(criteria && criteria['selectedDegree'] === '1' && criteria['selectedTerm'] === 'sem7' && criteria['selectedGroup'] === '41') {
          return (<div>
            {JSON.stringify(item["__EMPTY_1"])}
            {JSON.stringify(item["__EMPTY_16"])}
          </div>)
         } else if(criteria && criteria['selectedDegree'] === '1' && criteria['selectedTerm'] === 'sem7' && criteria['selectedGroup'] === '42') {
          return (<div>
            {JSON.stringify(item["__EMPTY_1"])}
            {JSON.stringify(item["__EMPTY_18"])}
          </div>)
         } else if(criteria && criteria['selectedDegree'] === '2' && criteria['selectedTerm'] === 'sem1' && criteria['selectedSpecialization'] === 'ds' && criteria['selectedGroup'] === 'DS1') {
          return (<div>
            {JSON.stringify(item["__EMPTY_1"])}
            {JSON.stringify(item["__EMPTY_22"])}
          </div>)
         } else if(criteria && criteria['selectedDegree'] === '2' && criteria['selectedTerm'] === 'sem1' && criteria['selectedSpecialization'] === 'ds' && criteria['selectedGroup'] === 'DS2') {
            return (<div>
              {JSON.stringify(item["__EMPTY_1"])}
              {JSON.stringify(item["__EMPTY_23"])}
            </div>)
         } else if(criteria && criteria['selectedDegree'] === '2' && criteria['selectedTerm'] === 'sem1' && criteria['selectedSpecialization'] === 'cybsec' && criteria['selectedGroup'] === 'CY1') {
          return (<div>
            {JSON.stringify(item["__EMPTY_1"])}
            {JSON.stringify(item["__EMPTY_24"])}
          </div>)
        } else if(criteria && criteria['selectedDegree'] === '2' && criteria['selectedTerm'] === 'sem1' && criteria['selectedSpecialization'] === 'cybsec' && criteria['selectedGroup'] === 'CY2') {
          return (<div>
            {JSON.stringify(item["__EMPTY_1"])}
            {JSON.stringify(item["__EMPTY_25"])}
          </div>)
         } else if(criteria && criteria['selectedDegree'] === '2' && criteria['selectedTerm'] === 'sem1' && criteria['selectedSpecialization'] === 'cybsec' && criteria['selectedGroup'] === 'CY3') {
            return (<div>
              {JSON.stringify(item["__EMPTY_1"])}
              {JSON.stringify(item["__EMPTY_26"])}
            </div>)
         } else if(criteria && criteria['selectedDegree'] === '2' && criteria['selectedTerm'] === 'sem3' && criteria['selectedSpecialization'] === 'cybsec' && criteria['selectedGroup'] === 'CY1') {
          return (<div>
            {JSON.stringify(item["__EMPTY_1"])}
            {JSON.stringify(item["__EMPTY_27"])}
          </div>)
        } else if(criteria && criteria['selectedDegree'] === '2' && criteria['selectedTerm'] === 'sem3' && criteria['selectedSpecialization'] === 'cybsec' && criteria['selectedGroup'] === 'CY2') {
            return (<div>
              {JSON.stringify(item["__EMPTY_1"])}
              {JSON.stringify(item["__EMPTY_28"])}
            </div>)
        } else if(criteria && criteria['selectedDegree'] === '2' && criteria['selectedTerm'] === 'sem3' && criteria['selectedSpecialization'] === 'cybsec' && criteria['selectedGroup'] === 'CY3') {
          return (<div>
            {JSON.stringify(item["__EMPTY_1"])}
            {JSON.stringify(item["__EMPTY_29"])}
          </div>)
         } else if(criteria && criteria['selectedDegree'] === '2' && criteria['selectedTerm'] === 'sem3' && criteria['selectedSpecialization'] === 'ds' && criteria['selectedGroup'] === 'DS1') {
          return (<div>
            {JSON.stringify(item["__EMPTY_1"])}
            {JSON.stringify(item["__EMPTY_30"])}
          </div>)
         }
        })
         : null}
    </div>
  );
}

export default App;
