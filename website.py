from flask import Flask, request, jsonify
import joblib 

app = Flask(__name__)

try:
    model = joblib.load('co2_model.pkl')
except:
    model = None
    print("⚠️ ALERT: co2_model.pkl not found in this folder!")

@app.route('/calculate-impact', methods=['POST'])
def calculate_impact():
    if model is None:
        return jsonify({"error": "AI model not found on server"}), 500

 
    data = request.json
    
    # 3. Prepare features for Scikit-learn
    # IMPORTANT: The order here must match the order your friend used to train!
    # Example: [plastic_count, glass_count, paper_weight]
    features = [[
        data.get('plastic', 0),
        data.get('glass', 0),
        data.get('paper', 0)
    ]]

 
    prediction = model.predict(features)
    co2_saved = float(prediction[0])

    return jsonify({
        "metric": "kg of CO2 saved",
        "value": round(co2_saved, 4),
        "flora_score": int(co2_saved * 10)  
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)