import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, CloudArrowUpIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';


const API_URL = 'http://localhost:5000';

const MainPage = () => {
  const [files, setFiles] = useState([]);
  const [processedFiles, setProcessedFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [model, setModel] = useState('gemini');
  const [chatHistory, setChatHistory] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleFileUpload = (event) => {
    const newFiles = Array.from(event.target.files).filter(file => file.type === 'application/pdf');
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
  };

  const handleProcessFiles = async () => {
    setProcessing(true);
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    try {
      console.log('Attempting to connect to:', `${API_URL}/api/process`);
      const response = await fetch(`${API_URL}/api/process`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        },
      });

      console.log('Response received:', response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);

      setProcessedFiles(prevFiles => [...prevFiles, ...files]);
      setFiles([]);
      alert(data.message);
    } catch (error) {
      console.error('Error details:', error);
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        alert('Unable to connect to the server. Please check if the backend is running and accessible.');
      } else {
        alert(`An error occurred while processing files: ${error.message}`);
      }
    } finally {
      setProcessing(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!question.trim()) return;

    try {
      const response = await fetch(`${API_URL}/api/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, model }),
      });
      const data = await response.json();
      if (response.ok) {
        setAnswer(data.answer);
        setChatHistory(prevHistory => [...prevHistory, { question, answer: data.answer }]);
        setQuestion('');
      } else {
        alert(data.error || 'An error occurred while processing your question');
      }
    } catch (error) {
      console.error('Error asking question:', error);
      alert('An error occurred while processing your question');
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_URL}/api/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        setProcessedFiles([]);
        setChatHistory([]);
        navigate('/');
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      alert('An error occurred during logout. Please try again.');
    }
  };

  const removeFile = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                className="h-10 w-auto"
                src="DOCAI.svg"
                alt=""
              />
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
              <a href="/main"class="mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Home</a>

          </div>
          <div className="hidden lg:flex lg:gap-x-12">
              <a href="/about"class="mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">About</a>

          </div>

          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <button
              onClick={handleLogout}
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Log out <span aria-hidden="true">&rarr;</span>
            </button>
          </div>
        </nav>
        <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
          <div className="fixed inset-0 z-50" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <img
                  className="h-8 w-auto"
                  src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                  alt=""
                />
              </a>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  <a
                    href="#"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Features
                  </a>
                  <a
                    href="#"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    How it works
                  </a>
                </div>
                <div className="py-6">
                  <button
                    onClick={handleLogout}
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Log out
                  </button>
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>

      <main>
        <div className="relative isolate px-6 pt-14 lg:px-8">
          <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Chat with your PDFs & Images using AI
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Upload your PDF documents or Images, process them, and ask questions to get instant answers powered by advanced AI models.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <label htmlFor="file-upload" className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                  Upload PDFs
                </label>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={handleProcessFiles}
                  disabled={processing || files.length === 0}
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  Process Files {processing ? '...' : <span aria-hidden="true">→</span>}
                </button>
              </div>
            </div>
          </div>
        </div>

        {files.length > 0 && (
          <div className="mx-auto max-w-7xl px-6 lg:px-8 mb-8">
            <h2 className="text-lg font-semibold mb-2">Files to Upload:</h2>
            <ul className="divide-y divide-gray-200">
              {files.map((file, index) => (
                <li key={index} className="py-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <CloudArrowUpIcon className="h-6 w-6 text-indigo-600 mr-3" />
                    <span>{file.name}</span>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {processedFiles.length > 0 && (
          <div className="mx-auto max-w-7xl px-6 lg:px-8 mb-8">
            <h2 className="text-lg font-semibold mb-2">Processed Files:</h2>
            <ul className="divide-y divide-gray-200">
              {processedFiles.map((file, index) => (
                <li key={index} className="py-4 flex items-center">
                  <CloudArrowUpIcon className="h-6 w-6 text-green-600 mr-3" />
                  <span>{file.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {processedFiles.length > 0 && (
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-indigo-600">Ask Questions</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Get answers from your documents
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
              <div className="mb-4">
                <label htmlFor="question" className="block text-sm font-medium leading-6 text-gray-900">
                  Your Question
                </label>
                <div className="mt-2 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    name="question"
                    id="question"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder=" Ask a question about your documents"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={handleAskQuestion}
                    className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    Ask
                  </button>
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="model" className="block text-sm font-medium leading-6 text-gray-900">
                  Select Model
                </label>
                <select
                  id="model"
                  name="model"
                  className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                >
                  <option value="gemini">Gemini</option>
                  <option value="groq">Groq</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {chatHistory.length > 0 && (
          <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-16">
            <h2 className="text-2xl font-bold mb-4">Chat History</h2>
            <ul className="space-y-4">
              {chatHistory.map((chat, index) => (
                <li key={index} className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Q: {chat.question}
                    </h3>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      A: {chat.answer}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
      
    </div>
  );
};

export default MainPage;