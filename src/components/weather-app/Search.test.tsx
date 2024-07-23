import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, vi } from "vitest";
import axios from "axios";
import Search from "./Search";

vi.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Search Component", () => {
  it("shows error message when no data is found", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] });
    render(<Search />);
    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.change(input, { target: { value: "Nonexistent City" } });
    const button = screen.getByRole("button");
    fireEvent.click(button);

    await waitFor(() => {
      const errorMessage = screen.queryByText(
        /City called "Nonexistent City" was not found/i
      );
      expect(errorMessage).not.toBeNull();
    });
  });
});
