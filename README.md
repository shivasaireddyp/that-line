# ThatLine 🎬

Ever remember a line from a movie but can't place it? Stop endlessly searching. **ThatLine** is a simple, AI-powered tool that finds the exact dialogue you're looking for from any subtitle file.



## About The Project

⋅⋅⋅⋅* Ever know the movie and remember a specific line, but can't find the exact scene? Scrubbing through a two-hour film to find one moment is a frustrating experience.

⋅⋅⋅⋅* ThatLine is designed to solve this exact problem. By uploading the movie's subtitle file (in .srt format), you can instantly search for any dialogue. But it's more than just a keyword search.

⋅⋅⋅⋅* Powered by AI, ThatLine uses semantic search to understand the meaning and context of your query. This means you can find the scene even if you only remember the gist of the dialogue, not the exact words.

⋅⋅⋅⋅* For movie fans, it's the fastest way to relive a favorite moment. For video editors and content creators, it's an essential tool for quickly locating specific clips, saving hours of manual searching.

Just upload a standard `.srt` subtitle file, type what you remember, and get instant results with timestamps.

### Built With

This project was brought to life with some amazing modern technologies:

* **Frontend:** [Next.js](https://nextjs.org/) & [React](https://reactjs.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Backend:** [FastAPI](https://fastapi.tiangolo.com/) & [Python](https://www.python.org/)
* **AI / Embeddings:** [Hugging Face Inference API](https://huggingface.co/inference-api)
* **Search Index:** [Faiss](https://faiss.ai/) by Meta AI
* **Deployment:** [Vercel](https://vercel.com/) & [Render](https://render.com/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* **npm** (Node.js package manager)
* **Python** (3.8+) and **pip**
* A **Hugging Face API Token** (for the backend)

### Installation

1.  **Clone the repo:**
    ```sh
    git clone [https://github.com/your_username/that-line.git](https://github.com/your_username/that-line.git)
    cd that-line
    ```

2.  **Setup the Backend:**
    * Navigate to the backend folder:
        ```sh
        cd backend
        ```
    * Create and activate a virtual environment:
        ```sh
        python -m venv .venv
        source .venv/bin/activate  # On Windows: .\.venv\Scripts\Activate
        ```
    * Install Python packages:
        ```sh
        pip install -r requirements.txt
        ```
    * Create a `.env` file and add your Hugging Face token:
        ```
        HUGGING_FACE_TOKEN="hf_YourTokenGoesHere"
        ```
    * Run the backend server (from the root `that-line` folder):
        ```sh
        uvicorn main:app --reload --app-dir backend
        ```

3.  **Setup the Frontend:**
    * Open a new terminal and navigate to the frontend folder:
        ```sh
        cd frontend
        ```
    * Install NPM packages:
        ```sh
        npm install
        ```
    * Create a `.env.local` file and add the local backend URL:
        ```
        NEXT_PUBLIC_API_URL=http://localhost:8000
        ```
    * Run the frontend dev server:
        ```sh
        npm run dev
        ```

## Usage

Using the live application is simple:
1.  **Upload File:** Click the upload button and select any standard `.srt` subtitle file.
2.  **Search Dialogue:** Type a word, phrase, or the general idea of the line you remember.
3.  **Get Instant Results:** The most relevant lines and their timestamps will appear instantly.

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Shivasaireddy P - [GitHub Profile](https://github.com/shivasaireddyp)

Project Link: [https://github.com/shivasaireddyp/that-line](https://github.com/shivasaireddyp/that-line)
