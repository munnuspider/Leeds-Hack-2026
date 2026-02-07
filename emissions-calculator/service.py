from calculator import CarbonCalculator


calculator = CarbonCalculator()


def calculate_user_daily_impact(user_daily_data):

    result = calculator.calculate_total(user_daily_data)

    return result
