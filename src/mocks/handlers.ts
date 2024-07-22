// src/mocks/handlers.js
import { http, HttpResponse } from "msw";
import { storedData } from "./data/data_weather_fake";

export const handlers = [
  http.get("/user", () => {
    return HttpResponse.json(storedData);
  }),

  http.post("/user", async (req, res, ctx) => {
    // In tất cả các thông tin từ yêu cầu để kiểm tra
    console.log("Request:", req);
    console.log("Request headers:", req.headers);
    console.log("Request body:", await req.text()); // In dữ liệu dưới dạng văn bản

    try {
      const newData = await req.json(); // Đợi dữ liệu JSON
      console.log("Parsed data:", newData); // In dữ liệu đã phân tích cú pháp

      storedData.push(newData);

      return res(
        ctx.json(newData, {
          status: 201,
        })
      );
    } catch (error) {
      console.error("Error processing request:", error);
      return res(
        ctx.status(500),
        ctx.json({ error: "Failed to process request" })
      );
    }
  }),
];
