from service import calculate_user_daily_impact

# Example user input
user_data = {

    "recycling": {
        "plastic_bottle_500ml": 2,
        "aluminium_can_100ml;": 1
    },

    "transport": {
        "walking_km": 3,
        "bus_km": 5
    }

}


result = calculate_user_daily_impact(user_data)

print("RESULT:")
print(result)
