# Chat-with-ImagePDF

Document AI Chat is an advanced document interaction platform that allows users to upload PDF documents and images, process them using AI, and engage in intelligent conversations about the content. This project combines a React frontend with a Flask backend, leveraging state-of-the-art AI models to provide insightful answers to user queries about both textual and visual content.
![image](https://github.com/user-attachments/assets/26270d93-0cb6-4540-9e42-b422a08f5e6e)

![image](https://github.com/user-attachments/assets/8e466e6f-92af-48c0-87ec-f88a7b420c0a)

![image](https://github.com/user-attachments/assets/3bde3026-6269-41d3-aebf-38509d3fa6fc)




## Features

- **PDF and Image Upload**: Users can upload multiple PDF documents and various image formats for processing.
- **AI-Powered Document and Image Processing**: Utilizes advanced AI models to extract and understand content from uploaded PDFs and images.
- **OCR Capability**: Incorporates Optical Character Recognition to extract text from images and scanned documents.
- **Interactive Chat Interface**: Enables users to ask questions about the processed documents and images, receiving AI-generated responses.
- **Multi-Model Support**: Offers the choice between Gemini and Groq AI models for diverse query processing capabilities.
- **User Authentication**: Secure login and signup functionality to protect user data and conversations.
- **Responsive Design**: A clean, intuitive interface that works seamlessly across devices.
- **Docker Support**: Easy deployment using Docker and Docker Compose.

## Technology Stack

- **Frontend**: React.js with Tailwind CSS for styling
- **Backend**: Flask (Python)
- **Database**: SQLite
- **AI Models**: Google's Gemini and Groq
- **Authentication**: Custom implementation with Flask session management
- **File Processing**: PyMuPDF for PDFs, Pillow for image handling
- **OCR**: Tesseract OCR for text extraction from images
- **Vector Storage**: FAISS for efficient similarity search
- **Containerization**: Docker and Docker Compose

## Getting Started

### Prerequisites

- Docker and Docker Compose
- (For manual setup) Node.js (v14 or later), Python (v3.8 or later), pip, and Tesseract OCR

### Installation and Running (Docker method)

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/document-ai-chat.git
   cd document-ai-chat
   ```

2. Create a `.env` file in the root directory with the following content:
   ```
   GOOGLE_API_KEY=your_google_api_key
   GROQ_API_KEY=your_groq_api_key
   ```

3. Build and run the application using Docker Compose:
   ```
   docker-compose up --build
   ```

4. Open your browser and navigate to `http://localhost:3000` to use the application.

### Manual Installation (Alternative)

If you prefer to run the application without Docker:

1. Follow steps 1-5 from the "Installation" section in the previous version of this README.

2. Start the backend server:
   ```
   cd backend
   flask run
   ```

3. In a new terminal, start the frontend development server:
   ```
   cd frontend
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`.

## Usage

1. **Sign Up/Login**: Create an account or log in to an existing one.
2. **Upload Documents**: Use the "Upload PDFs" button to select and upload your PDF documents and images.
3. **Process Files**: Click "Process Files" to initiate AI processing of the uploaded documents and images.
4. **Ask Questions**: Once processing is complete, use the chat interface to ask questions about your documents and images.
5. **Switch Models**: Choose between Gemini and Groq models for different AI processing capabilities.
6. **View Chat History**: Scroll through your conversation history to review previous questions and answers.

## Key Components

- `docker-compose.yml`: Defines the multi-container Docker application.
- `Main.py`: Handles document processing, OCR, and AI model interactions.
- `App.py`: Flask backend managing API endpoints and user sessions.
- `MainPage.js`: React component for the main interface, including file upload and chat functionality.
- `LoginPage.js` and `Signup.js`: Handle user authentication.
- `Forget_password.js`: Manages password reset functionality.

## Contributing

We welcome contributions to the Document AI Chat project! Please follow these steps to contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
5. Push to the branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Google Generative AI for the Gemini model
- Groq for their AI model
- Tesseract OCR for text extraction from images
- The open-source community for the various libraries and tools used in this project

## Contact

https://www.linkedin.com/in/syedmustafa177/

Project Link: (https://github.com/Syedmustafa177/Chat-with-ImagePDF)
