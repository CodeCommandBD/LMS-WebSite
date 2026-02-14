import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

function App() {
  return (
    <div>
      <h1>Learn Management System</h1>
    </div>
  );
}

test("renders learn management system heading", () => {
  render(<App />);
  const linkElement = screen.getByText(/learn management system/i);
  expect(linkElement).toBeInTheDocument();
});
