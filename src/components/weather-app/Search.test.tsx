import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Search from './Search';
import '@testing-library/jest-dom'; 

const apiKey = "85ca72f1b6e7246de11846015225c31d";
const searchUrl = (query: string) => {
  const encodedQuery = encodeURIComponent(query);
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${encodedQuery}&limit=3&appid=${apiKey}`;
  return url;
};

const replaceSpace= (data:string)=>{
  return data.replace(/ /g, '%20')
}

describe("Search Component", () => {
  let mock: MockAdapter;
  beforeEach(() => {
    mock = new MockAdapter(axios);
  });
  afterEach(() => {
    mock.restore();
  });

  test("Show error message when no data is found", async () => {
    const testQuery = "Ha Noi dfsdfsdf";
    const url = searchUrl(testQuery);
    mock.onGet(url).reply(200, []);

    render(<Search />);
    const input = screen.getByPlaceholderText(/Search/i);
    fireEvent.change(input, { target: { value: replaceSpace(testQuery) } });
    const button = screen.getByRole("button");
    fireEvent.click(button);

    await waitFor(() => {
      const errorMessage = screen.getByText((_content, element) => {
        return element?.textContent === `City called "${replaceSpace(testQuery)}" was not found`;
      });
      expect(errorMessage).toBeInTheDocument();
    });
  });
  test("Test display success", async () => {
    const testQuery = "Ha Noi";
    const url = searchUrl(testQuery);
    const mockData = [
      { name: "Hanoi", country: "VN", lat: 21.0285, lon: 105.8542 },
    ];
    mock.onGet(url).reply(200, mockData);
    render(<Search />);
    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.change(input, { target: { value: replaceSpace(testQuery)  } });
    const button = screen.getByRole("button");
    fireEvent.click(button);

    await waitFor(() => {
      const result = screen.getByText("Hanoi, VN");
      expect(result).toBeInTheDocument();
      const coordinates = screen.getByText("21.0285, 105.8542");
      expect(coordinates).toBeInTheDocument();
    });
  });
});
