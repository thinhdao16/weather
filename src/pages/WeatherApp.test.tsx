import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import WeatherApp from "./WeatherApp";

const mockData = [
  {
    id: 2643743,
    name: "Hanoi",
    main: { temp: 298, humidity: 70 },
    weather: [{ description: "clear sky", icon: "01d" }],
    wind: { speed: 1.5 },
    visibility: 10000,
  }
];

describe("WeatherApp Component", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  test("call and displays weather data", async () => {
    mock.onGet("/user").reply(200, mockData);

    render(<WeatherApp />);

    await waitFor(() => {
      expect(screen.getByText("Hanoi")).toBeInTheDocument();
      expect(screen.getByText("25°C")).toBeInTheDocument();
      expect(screen.getByText("clear sky")).toBeInTheDocument();
    });
  });

  test("handles delete weather", async () => {
    mock.onGet("/user").reply(200, mockData);
    mock.onDelete("/api/messages/2643743").reply(200);

    render(<WeatherApp />);

    await waitFor(() => screen.getByText("Hanoi"));

    fireEvent.click(screen.getByRole("button", { name: /delete/i }));

    await waitFor(() => {
      expect(mock.history.delete.length).toBe(1);
      expect(mock.history.delete[0].url).toBe("/api/messages/2643743");
    });
  });

  test("renders Search component", () => {
    render(<WeatherApp />);
    expect(screen.getByPlaceholderText(/Search/i)).toBeInTheDocument();
  });
});
