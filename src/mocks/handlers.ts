import { http, HttpResponse } from "msw";
import { storedData } from "./data/data_weather_fake";
import { data_access_management } from "./data/data_access_management";

export const handlers = [
  http.get("/user", () => {
    return HttpResponse.json(storedData);
  }),

  http.post("/api/messages", async ({ request }: any) => {
    const requestBody = await request.json();
    const data = requestBody?.dataSave;
    storedData.push(data);
    return HttpResponse.json(data, {
      status: 201,
    });
  }),
  http.delete("/api/messages/:id", ({ params }) => {
    const { id }: any = params;
    const postId = parseInt(id, 10);

    const index = storedData.findIndex((item) => item.id === postId);

    if (index === -1) {
      return HttpResponse.json({ message: "Not Found" }, { status: 404 });
    }
    const [deletedPost] = storedData.splice(index, 1);
    return HttpResponse.json(deletedPost, { status: 200 });
  }),
  //access-manager
  http.get("/access-manager", () => {
    return HttpResponse.json({ data_access_management });
  }),
  http.delete("/access-manager/:email", ({ params }) => {
    const { email }: any = params;
    const index = data_access_management.findIndex(
      (item) => item.email === email
    );
    if (index === -1) {
      return HttpResponse.json({ message: "Not Found" }, { status: 404 });
    }
    const [deletedPost] = data_access_management.splice(index, 1);
    return HttpResponse.json(deletedPost, { status: 200 });
  }),
  http.put("/access-manager-role", async ({ request }: { request: any }) => {
    const requestBody = await request.json();
    const user = data_access_management.find(user => user.email === requestBody?.email)
    console.log(requestBody)
    if (user) {
      user.role = requestBody?.role
      return HttpResponse.json({ message: "Update role success", user }, { status: 201 });
    } else {
      return HttpResponse.json({ message: "Not Found" }, { status: 404 });
    }
  }),
  http.post("/access-manager", async ({request}:{request:any})=>{
const requestBody = await request.json()

  })
];
