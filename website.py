from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib 

app = Flask(__name__)
CORS(app)

leaderboard_data = []


try:
    model = joblib.load('co2_prediction_model.pkl')
except:
    model = None
    print("⚠️ ALERT: co2_model.pkl not found! Using backup math for now.")

@app.route('/')
def home():
    return "Eco-Galaxy is running! Space-travelers welcome"

@app.route('/leaderboard', methods=['GET'])
def get_leaderboard():
   
    return jsonify(leaderboard_data[:10])

@app.route('/calculate-impact', methods=['POST'])
def calculate_impact():
    data = request.json
    username = data.get('username', 'Anonymous Explorer')
    
    # Input data from the frontend
    plastic = data.get('plastic', 0)
    glass = data.get('glass', 0)

    # 1. AI Logic (Scikit-learn)
    if model:
        # Match the features your friend used (e.g., [Plastic, Glass])
        features = [[plastic, glass]]
        prediction = model.predict(features)
        co2_saved = float(prediction[0])
    else:

        co2_saved = (plastic * 0.05) + (glass * 0.1)

 
    user_entry = {
        "username": username, 
        "co2_saved": round(co2_saved, 4)
    }
    leaderboard_data.append(user_entry)
    

    leaderboard_data.sort(key=lambda x: x['co2_saved'], reverse=True)

    return jsonify({
        "status": "success",
        "metric": "kg of CO2 saved",
        "value": round(co2_saved, 4),
        "username": username,
        "flora_score": int(co2_saved * 10)  
    })


@app.route('/reset', methods=['POST'])
def reset_leaderboard():
    global leaderboard_data
    leaderboard_data = []
    return jsonify({"message": "Galaxy reset successful!"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)