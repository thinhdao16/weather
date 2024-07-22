import { http, HttpResponse } from 'msw';
import { storedData } from './data/data_weather_fake';



export const handlers = [
  http.get('/user', () => {
    return HttpResponse.json(storedData);
  }),

  http.post('/user', (req:any) => {
    const newData = req.json();
    storedData.push(newData);

    return HttpResponse.json(newData, {
      status: 201,
    });
  }),
];
