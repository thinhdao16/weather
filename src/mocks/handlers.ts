import { http, HttpResponse } from 'msw';
import { storedData } from './data/data_weather_fake';



export const handlers = [
  http.get('/user', () => {
    return HttpResponse.json(storedData);
  }),

  
  http.post("/api/messages", async ({ request }:any) => {
		const requestBody = await request.json();
    const data = requestBody?.dataSave
    storedData.push(data);
    return HttpResponse.json(data, {
      status: 201,
    })
	}),
  http.delete('/api/messages/:id', ({ params }) => {
    const { id }:any = params;
    const postId = parseInt(id, 10);

    const index = storedData.findIndex(item => item.id === postId);

    if (index === -1) {
      return HttpResponse.json({ message: "Not Found" }, { status: 404 });
    }

    // Xóa mục khỏi mảng
    const [deletedPost] = storedData.splice(index, 1);

    // Trả về mục đã xóa
    return HttpResponse.json(deletedPost, { status: 200 });
  }),
];
