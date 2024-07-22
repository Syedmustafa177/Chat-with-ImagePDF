from flask import Flask, request, jsonify, session
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import sqlite3
import os
import traceback
import shutil
from Main import process_files, ask_question



app = Flask(__name__)
app.secret_key = os.urandom(24)  # Set a secret key for session encryption
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)




DATABASE = os.path.join(os.path.dirname(__file__), 'users.db')
UPLOAD_FOLDER = 'uploads'

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    if not os.path.exists(DATABASE):
        conn = sqlite3.connect(DATABASE)
        with open('schema.sql', 'r') as f:
            conn.executescript(f.read())
        conn.close()
        print(f"Database initialized at {DATABASE}")
    else:
        print(f"Database already exists at {DATABASE}")

with app.app_context():
    init_db()

@app.route('/api/signup', methods=['POST', 'OPTIONS'])
def signup():
    if request.method == 'OPTIONS':
        return '', 204
    conn = None
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400
        
        conn = get_db_connection()
        password_hash = generate_password_hash(password)
        cursor = conn.cursor()
        cursor.execute('INSERT INTO users (email, password_hash) VALUES (?, ?)',
                     (email, password_hash))
        conn.commit()
        return jsonify({"message": "User created successfully"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"error": "Email already exists"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

@app.route('/api/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return '', 204
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        
        print(f"Login attempt for email: {email}")  # Debug print
        
        if not email or not password:
            print("Email or password missing")  # Debug print
            return jsonify({"error": "Email and password are required"}), 400
        
        conn = get_db_connection()
        user = conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
        conn.close()
        
        if user:
            print(f"User found: {user['email']}")  # Debug print
            if check_password_hash(user['password_hash'], password):
                print("Password correct")  # Debug print
                session['user_id'] = user['id']
                return jsonify({"message": "Login successful"}), 200
            else:
                print("Password incorrect")  # Debug print
        else:
            print("User not found")  # Debug print
        
        return jsonify({"error": "Invalid email or password"}), 401
    except Exception as e:
        print(f"Login error: {str(e)}")  # Debug print
        return jsonify({"error": str(e)}), 500

@app.route('/api/logout', methods=['POST'])
def logout():
    try:
        # Clear the user's session
        session.clear()
        
        # Delete uploaded files
        upload_folder = app.config['UPLOAD_FOLDER']
        for filename in os.listdir(upload_folder):
            file_path = os.path.join(upload_folder, filename)
            try:
                if os.path.isfile(file_path) or os.path.islink(file_path):
                    os.unlink(file_path)
                elif os.path.isdir(file_path):
                    shutil.rmtree(file_path)
            except Exception as e:
                print(f'Failed to delete {file_path}. Reason: {e}')
        
        # Clear the vector stores
        if os.path.exists("faiss_index_gemini"):
            shutil.rmtree("faiss_index_gemini")
        if os.path.exists("faiss_index_groq"):
            shutil.rmtree("faiss_index_groq")
        
        return jsonify({"message": "Logged out successfully"}), 200
    except Exception as e:
        app.logger.error(f"Error in /api/logout: {str(e)}")
        app.logger.error(traceback.format_exc())
        return jsonify({"error": str(e)}), 500

@app.route('/api/process', methods=['POST', 'OPTIONS'])
def process():
    app.logger.info(f"Received request: {request.method}")
    if request.method == 'OPTIONS':
        return '', 204
    try:
        app.logger.info(f"Request files: {request.files}")
        if 'files' not in request.files:
            app.logger.error("No file part in the request")
            return jsonify({"error": "No file part"}), 400
        files = request.files.getlist('files')
        if not files:
            app.logger.error("No selected file")
            return jsonify({"error": "No selected file"}), 400
        
        file_paths = []
        for file in files:
            if file.filename == '':
                continue
            if file:
                filename = secure_filename(file.filename)
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(file_path)
                file_paths.append(file_path)
        
        if not file_paths:
            app.logger.error("No valid files uploaded")
            return jsonify({"error": "No valid files uploaded"}), 400

        app.logger.info(f"Processing files: {file_paths}")
        result = process_files(file_paths)
        app.logger.info(f"Processing result: {result}")
        return jsonify({"message": "Files processed successfully", "result": result}), 200
    except Exception as e:
        app.logger.error(f"Error in /api/process: {str(e)}")
        app.logger.error(traceback.format_exc())
        return jsonify({"error": str(e), "traceback": traceback.format_exc()}), 500

@app.route('/api/ask', methods=['POST', 'OPTIONS'])
def ask():
    if request.method == 'OPTIONS':
        return '', 204
    try:
        data = request.json
        if not data or 'question' not in data:
            return jsonify({"error": "No question provided"}), 400
        
        question = data['question']
        model = data.get('model', 'gemini')
        
        answer = ask_question(question, model)
        return jsonify({"answer": answer}), 200
    except Exception as e:
        app.logger.error(f"Error in /api/ask: {str(e)}")
        app.logger.error(traceback.format_exc())
        return jsonify({"error": str(e), "traceback": traceback.format_exc()}), 500

if __name__ == '__main__':
    app.run(debug=True)