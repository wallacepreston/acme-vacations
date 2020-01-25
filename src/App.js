import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './App.css';

const apiUrl = 'https://acme-users-api-rev.herokuapp.com/api'

function App() {
  const [user, setUser] = useState({});
  const [vacations, setVacations] = useState([]);
  const fetchUser = async () => {
    const appStorage = window.localStorage;
    const userId = appStorage.getItem('userId');
    let user;
    if(userId) {
      try {
        user = (await axios.get(`${apiUrl}/users/detail/${userId}`)).data;
      } catch (err) {
        appStorage.removeItem('userId');
        return fetchUser();
      }
    } else {
      user = (await axios.get(`${apiUrl}/users/random`)).data;
      appStorage.setItem('userId', user.id)
    }
    console.log(user);
    setUser(user)
  }
  const fetchVacations = async () => {
    if(!user.id) return;
    const response = await axios.get(`${apiUrl}/users/${user.id}/vacations`);
    console.log(response);
    setVacations(response.data);
  }
  useEffect(() => {
    fetchUser();
  }, []);
  useEffect(() => {
    fetchVacations();
  }, [user])
  return (
    <div className="App">
      <main>
        <h1>Acme Vacations</h1>
        <div>Name: {user && user.fullName}</div>
        <div>Vacations: {vacations && vacations.map(vacation => {
          const startDate = new Date(vacation.startDate);
          const endDate = new Date(vacation.endDate);
          const numDays = endDate.getDay() - startDate.getDay();
          return (
            <div key={vacation.id}>
              {startDate.toDateString()} to {endDate.toDateString()} ({numDays} days)

            </div>
          )
        }
        
        )}</div>
      </main>
    </div>
  );
}

export default App;
