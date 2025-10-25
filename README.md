<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

# Math Problem Generator for Kids

This application helps 3rd-grade students practice math. It uses the Google Gemini API to generate custom math problem sheets covering addition, subtraction, multiplication, and division. Users can specify a number range, the number of problems, and the complexity of the operations. The generated sheet can be downloaded as a `.docx` file for printing.

![Screenshot of the App] <!-- Add a screenshot of your app here for a better presentation -->

## Features

-   Generate math problems with 1 or 2 operations.
-   Customize the number range (e.g., from 1 to 100).
-   Select which operations to include (+, -, *, /).
-   Optionally include parentheses for more complex problems.
-   View the generated problems directly in the browser.
-   Download the problem sheet as a formatted Microsoft Word (`.docx`) file.

## How to Run This Project

This project is designed to run in a web-based development environment that supports modern JavaScript (ES modules) and can securely provide a Google Gemini API key.

1.  **Get a Gemini API Key:**
    *   Go to [Google AI Studio](https://aistudio.google.com/app/apikey) to create your API key.

2.  **Set up the Environment:**
    *   Clone or download the code from this repository.
    *   Open the project in a compatible development environment (like Google AI Studio's Web App tool, or a local setup with a bundler like Vite).
    *   Make sure your environment is configured to provide your Gemini API key as an environment variable named `API_KEY`. The code expects to access it via `process.env.API_KEY`.

3.  **Run the Application:**
    *   Once the environment is set up with the API key, the application should run automatically.
    *   Use the controls to configure the math problems and click "Khởi tạo" (Generate) to create a new sheet.

## Technologies Used

-   React
-   TypeScript
-   Tailwind CSS
-   Google Gemini API (`@google/genai`)
-   `docx` for Word document generation

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
