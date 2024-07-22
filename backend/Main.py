import os
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
import google.generativeai as genai
from langchain.vectorstores import FAISS
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains.question_answering import load_qa_chain
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv
from langchain.embeddings import HuggingFaceEmbeddings
from groq import Groq
import pytesseract
from PIL import Image
import fitz  # PyMuPDF

load_dotenv()

genai.configure(api_key=os.getenv("Google_API_KEY"))

# Set the path to the Tesseract executable
pytesseract.pytesseract.tesseract_cmd = r'Tesseract-OCR\tesseract.exe'

def get_pdf_text(file_paths):
    text = ""
    for file_path in file_paths:
        try:
            if file_path.lower().endswith('.pdf'):
                pdf_document = fitz.open(file_path)
                
                for page_num in range(len(pdf_document)):
                    page = pdf_document[page_num]
                    page_text = page.get_text()
                    
                    if not page_text.strip():
                        pix = page.get_pixmap()
                        img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                        page_text = pytesseract.image_to_string(img)
                    
                    text += page_text
                
                pdf_document.close()
            else:
                text += ocr_image(file_path)
        except Exception as e:
            print(f"Error processing {file_path}: {str(e)}")
    return text

def ocr_image(file_path):
    try:
        image = Image.open(file_path)
        text = pytesseract.image_to_string(image)
        return text
    except Exception as e:
        print(f"OCR failed for {file_path}. Error: {str(e)}")
        return ""

def get_text_chunks(text):
    if not text.strip():
        return []
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=10000, chunk_overlap=1000)
    chunks = text_splitter.split_text(text)
    return chunks

def get_vector_store_gemini(text_chunks):
       google_api_key = os.getenv('GOOGLE_API_KEY')
       if not google_api_key:
           raise ValueError("GOOGLE_API_KEY environment variable is not set")
       
       embeddings = GoogleGenerativeAIEmbeddings(
           model="models/embedding-001",
           google_api_key=google_api_key
       )
       vector_store = FAISS.from_texts(text_chunks, embedding=embeddings)
       vector_store.save_local("faiss_index_gemini")

def get_vector_store_groq(text_chunks):
    embeddings = HuggingFaceEmbeddings()
    vector_store = FAISS.from_texts(text_chunks, embedding=embeddings)
    vector_store.save_local("faiss_index_groq")

def get_conversational_chain_gemini():
    prompt_template = """
    Answer the question as detailed as possible from the provided context, make sure to provide all the details, if the answer is not in
    provided context just say, "answer is not available in the context", don't provide the wrong answer\n\n
    Context:\n {context}?\n
    Question: \n{question}\n

    Answer:
    """

    model = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.3)
    prompt = PromptTemplate(template=prompt_template, input_variables=["context", "question"])
    chain = load_qa_chain(model, chain_type="stuff", prompt=prompt)
    return chain

def get_groq_response(prompt):
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
        model="llama3-8b-8192",
    )
    return chat_completion.choices[0].message.content

def user_input_gemini(user_question):
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    new_db = FAISS.load_local("faiss_index_gemini", embeddings, allow_dangerous_deserialization=True)
    docs = new_db.similarity_search(user_question)
    chain = get_conversational_chain_gemini()
    response = chain(
        {"input_documents": docs, "question": user_question},
        return_only_outputs=True
    )
    return response["output_text"]

def user_input_groq(user_question):
    embeddings = HuggingFaceEmbeddings()
    new_db = FAISS.load_local("faiss_index_groq", embeddings, allow_dangerous_deserialization=True)
    docs = new_db.similarity_search(user_question)
    context = "\n".join([doc.page_content for doc in docs])
    prompt = f"""
    Answer the question as detailed as possible from the provided context, make sure to provide all the details, if the answer is not in
    provided context just say, "answer is not available in the context", don't provide the wrong answer

    Context:
    {context}

    Question:
    {user_question}

    Answer:
    """
    return get_groq_response(prompt)

def process_files(file_paths):
    text = get_pdf_text(file_paths)
    if not text:
        return "No text could be extracted from the files."
    
    text_chunks = get_text_chunks(text)
    if not text_chunks:
        return "No valid text chunks could be extracted."
    
    get_vector_store_gemini(text_chunks)
    get_vector_store_groq(text_chunks)
    return "Files processed successfully"

def ask_question(question, model='gemini'):
    if model == 'gemini':
        return user_input_gemini(question)
    elif model == 'groq':
        return user_input_groq(question)
    else:
        return "Invalid model specified"