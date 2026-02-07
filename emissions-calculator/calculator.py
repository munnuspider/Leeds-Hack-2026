from carbon_factors import CARBON_FACTORS


class CarbonCalculator:

    def __init__(self):
        self.factors = CARBON_FACTORS


    def calculate_recycling(self, recycling_data):

        co2_saved = 0

        co2_saved += recycling_data.get ("plastic_bottle_500ml", 0 ) * self.factors["plastic_bottle_500ml"]
        co2_saved += recycling_data.get("plastic_bottle_1L", 0) * self.factors["plastic_bottle_1L"]
        co2_saved += recycling_data.get("aluminium_can_100ml", 0) * self.factors["aluminium_can_100ml"]
        co2_saved += recycling_data.get("glass_bottle_500ml", 0) * self.factors["glass_bottle_500ml"]
        co2_saved += recycling_data.get("glass_bottle_300ml", 0) * self.factors["glass_bottle_300ml"]

        return co2_saved


    def calculate_transport(self, transport_data):

        co2_saved = 0

        co2_saved += transport_data.get("walking_km", 0) * self.factors["walking_per_km"]
        co2_saved += transport_data.get("bus_km", 0) * self.factors["bus_per_km_saved"]

        return co2_saved


    def calculate_total(self, user_data):

        recycling_data = user_data.get("recycling", {})
        transport_data = user_data.get("transport", {})

        recycling_co2 = self.calculate_recycling(recycling_data)

        transport_co2 = self.calculate_transport(transport_data)

        total_co2 = recycling_co2 + transport_co2

        return {
            "recycling_co2_saved": round(recycling_co2, 3),
            "transport_co2_saved": round(transport_co2, 3),
            "total_co2_saved": round(total_co2, 3),
            "unit": "kg CO2"
        }
