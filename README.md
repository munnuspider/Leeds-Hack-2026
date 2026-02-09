# Leeds-Hack-2026

GUIDE FOR USER!
Instructions / manual

1. open terminal, then type these one by one
2. cd LLM
3. curl -fsSL https://ollama.com/install.sh | sh
4. pip install fastapi uvicorn langchain langchain-community faiss-cpu pypdf
5. ollama serve
6. don't close this terminal

7. open second terminal:
8. cd LLM
9. ollama pull nomic-embed-text
10. ollama pull gemma3:1b

11. open third terminal:
12. cd LLM
13. uvicorn api:app --reload --port 8000
14. go to ports, find port 8000 and go to port visibility and make it public

15. open fourth terminal:
16. node -v
17. npm -v
18. npm install
20. npm run dev
21. open the port link provided




LOGIC AND FLOW OF PLANET WEBSITE
Back-end guide for Bhavya and Hafeezah

- CHATBOT
  - Using open source dataset with environmental science education
  - NLP
  - Genio: Rebooting learning
  - Google Gemini AI?

  
- XP TRACKERS
  - Tasks
    - Recycling bottles and cartons
    - Walking/ cycling
    - Electricity saved

  
- XP TRACKERS AND LEVELS
  - With every task accomplished, certain amount of XP is gained
  - A certain amount of XP is needed to progress to the next level
  - It will restart at the start of every level.
  - E.g. Level 1 needs 10 XP to get to Level 2. Level 2 needs 20 XP to get to level 3. And so on, increment by 10 XP each time.

  
- PREDICTION USING ML
  - Using current world statistics, greenhouse gas emissions, plus the tasks that the player has 
  - E.g. Predicting: “If you recycle __ bottles a day, in the next __ years this is what your planet is going to look like”
  - “How many bottles are you recycling?” or “How many kilometres did you walk instead of drive today?” or “How many hours did you turn off electricity today?”
    - User types in
  - “How many years of progress do you want to view?”
    - User types in
  - Then creates an output response!!!!!
  - Google Gemini AI?

  
- USERS
  - User data, information, and statistics
    - Username:
    - Continent:
    - Level (based on XP, based on task completion (refer to diagram))
    - Planets contributed to:

  
- FRIENDS SYSTEM – community
  - To access someone else’s planet, you need to befriend them. To befriend them, you have to be the same level as them. Level is based on XP based on the green tasks you have completed.
 

























THIS IS THE ORIGINAL SIGNIN HTML:


<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Sign Up / Login</title>

  <style>
    * {
      box-sizing: border-box;
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    }

    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #000;
      color: #fff;
    }

    h1 {
      position: absolute;
      top: 60px;
      font-size: 48px;
      font-weight: 300;
    }

    /* Outer card */
    .card {
      width: 90%;
      max-width: 900px;
      padding: 50px;
      border-radius: 16px;
      background: linear-gradient(135deg, #1f2a6d, #6a2c70);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
    }

    /* Inner panel */
    .panel {
      padding: 40px;
      border-radius: 14px;
      background: linear-gradient(135deg, #3a4aa8, #b14d9b);
    }

    .field {
      margin-bottom: 35px;
    }

    .field label {
      display: block;
      font-size: 28px;
      margin-bottom: 15px;
      text-align: center;
    }

    .input-wrapper {
      display: flex;
      align-items: center;
      border-radius: 12px;
      padding: 14px 18px;
      background: linear-gradient(135deg, #5866d9, #e064b7);
    }

    .icon {
      font-size: 26px;
      margin-right: 14px;
    }

    .input-wrapper input {
      width: 100%;
      background: transparent;
      border: none;
      outline: none;
      color: #fff;
      font-size: 20px;
    }

    .input-wrapper input::placeholder {
      color: rgba(255, 255, 255, 0.7);
    }

    /* Optional button (not shown in image but useful) */
    .btn {
      margin-top: 20px;
      width: 100%;
      padding: 14px;
      font-size: 18px;
      border-radius: 10px;
      border: none;
      cursor: pointer;
      color: #fff;
      background: linear-gradient(135deg, #6b7cff, #ff7ac7);
    }

    .btn:hover {
      opacity: 0.9;
    }
  </style>
</head>

<body>
  <h1>Sign Up / Login</h1>

  <div class="card">
    <div class="panel">

      <div class="field">
        <label>Username</label>
        <div class="input-wrapper">
          <span class="icon">🤖</span>
          <input type="text" placeholder="Enter username" />
        </div>
      </div>

      <div class="field">
        <label>Password</label>
        <div class="input-wrapper">
          <span class="icon">🤖</span>
          <input type="password" placeholder="Enter password" />
        </div>
      </div>

      <!-- Optional -->
      <!-- <button class="btn">Continue</button> -->

    </div>
  </div>
</body>
</html>



