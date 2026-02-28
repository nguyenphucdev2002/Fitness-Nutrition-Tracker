import json
import logging
import os
from datetime import date, datetime, timedelta

from flask_smorest import abort
from openai import OpenAI

from app.db import db
from app.models.food_log_model import FoodLogModel
from app.models.enums import MealTypeEnum
from app.services import user_profile_service

# Create logger for this module
logger = logging.getLogger(__name__)

# Initialize OpenAI client
openai_client = None


def get_openai_client():
    """Initialize and return OpenAI client"""
    global openai_client
    if openai_client is None:
        api_key = os.environ.get("OPENAI_API_KEY")
        if not api_key:
            logger.error("OPENAI_API_KEY not found in environment variables")
            abort(500, message="OpenAI API key not configured")
        openai_client = OpenAI(api_key=api_key)
    return openai_client

def calculate_bmr(weight, height, age, gender):
    """
    Mifflin-St Jeor formula
    """
    if gender and gender.lower() == "male":
        return 10 * weight + 6.25 * height - 5 * age + 5
    return 10 * weight + 6.25 * height - 5 * age - 161


ACTIVITY_MULTIPLIER = {
    "low": 1.2,       # Ít vận động (văn phòng, không tập)
    "medium": 1.375,  # Tập nhẹ / vừa (3–4 buổi / tuần)
    "high": 1.55,   # tập đều
}

def calculate_tdee(bmr, activity_level):
    return int(bmr * ACTIVITY_MULTIPLIER.get(activity_level, 1.2))


def get_target_calories(tdee, target):
    """
    target: gain_weight | lose_weight | gain_muscle | maintain_weight
    """
    if target == "gain_weight":
        return tdee + 300, tdee + 400
    if target == "gain_muscle":
        return tdee + 200, tdee + 300
    if target == "lose_weight":
        return tdee - 500, tdee - 300
    return tdee - 0, tdee + 100

def suggest_food_plan(user_id, day_plan=None, meal_type=None):
    """
    Suggest a personalized food plan for a user
    If day_plan is provided, suggest for that specific date.
    Otherwise, suggest for today.
    If meal_type is provided, suggest only for that meal.
    """
    # Get user profile
    user_profile = user_profile_service.get_user_profile(user_id)
    if not user_profile:
        logger.error(f"User profile not found for user_id: {user_id}")
        abort(404, message="User profile not found. Please create your profile first.")

    # Determine target date
    if day_plan:
        try:
            target_date = datetime.strptime(day_plan, "%Y-%m-%d").date()
        except ValueError:
            logger.error(f"Invalid date format for day_plan: {day_plan}")
            abort(400, message="Invalid date format. Please use YYYY-MM-DD")
    else:
        target_date = date.today()

    # Prepare user information for OpenAI
    user_info = {
        "age": user_profile.age,
        "gender": user_profile.gender.value if user_profile.gender else None,
        "height_cm": user_profile.height_cm,
        "weight_kg": user_profile.weight_kg,
        "bmi": user_profile.bmi,
        "activity_level": user_profile.activity_level.value if user_profile.activity_level else None,
        "target": user_profile.target
    }

    # Get recent food logs to avoid duplication (last 7 days + today)
    start_date = target_date - timedelta(days=7)
    recent_logs = FoodLogModel.query.filter(
        FoodLogModel.user_id == user_id,
        FoodLogModel.log_date >= start_date,
        FoodLogModel.log_date <= target_date
    ).all()
    
    recent_food_names = list(set([log.name for log in recent_logs]))
    recent_foods_str = ", ".join(recent_food_names) if recent_food_names else "Chưa có món ăn nào"

    # Specific meal type prompt addition
    meal_type_prompt = ""
    target_count_prompt = "Các món ăn (trong 1 ngày)"
    is_full_day = False
    
    if meal_type:
        if isinstance(meal_type, str) and meal_type.lower() == "all":
            meal_type_prompt = (
            "- Đề xuất thực đơn cho CẢ 4 BỮA: "
            "Sáng (Breakfast), Trưa (Lunch), "
            "Tối (Dinner) và Phụ (Snack)."
            )
            is_full_day = True
        else:
            # Handle Enum or string specific meal type
            meal_type_value = meal_type.value if hasattr(meal_type, 'value') else meal_type
            meal_type_prompt = f"- Chỉ đề xuất món ăn cho bữa: {meal_type_value}"
    else:
         # Default to suggest 1 random healthy dish if no meal type specified
         pass
    
    bmr = calculate_bmr(
    user_info["weight_kg"],
    user_info["height_cm"],
    user_info["age"],
    user_info["gender"]
    )

    tdee = calculate_tdee(bmr, user_info["activity_level"])
    min_cal, max_cal = get_target_calories(tdee, user_info["target"])

    # Create prompt for OpenAI
    prompt = f"""Bạn là một chuyên gia dinh dưỡng cho người bình thường (KHÔNG phải vận động viên thể hình), am hiểu ẩm thực Việt Nam theo phong cách Healthy / Eat Clean.

    Hãy đề xuất {target_count_prompt} món ăn Việt Nam KHỎE MẠNH phù hợp cho người bình thường, hoặc người tập gym phổ thông.

Thông tin người dùng:
- Tuổi: {user_info['age']}
- Giới tính: {user_info['gender']}
- Chiều cao: {user_info['height_cm']} cm
- Cân nặng: {user_info['weight_kg']} kg
- BMI: {user_info['bmi']}
- Mức độ hoạt động: {user_info['activity_level']}
- Mục tiêu: {user_info['target']}
- Các món đã ăn trong 7 ngày qua (HÃY TRÁNH GỢI Ý LẠI): {recent_foods_str}

{meal_type_prompt}

RÀNG BUỘC DINH DƯỠNG (BẮT BUỘC):
- Tổng calories của các món trong ngày PHẢI nằm trong khoảng {min_cal}-{max_cal} kcal
- Không được vượt quá giới hạn này
- Trong 7 ngày lượng calo mỗi ngày tương đương nhau
- Món ăn Việt Nam, chế biến healthy (ít dầu, ít đường, ít mặn)
- Ưu tiên thực phẩm giàu protein và chất xơ
- Không được trùng món
- Tự động gán meal_type phù hợp

ĐỊNH DẠNG TRẢ VỀ (CHỈ JSON, KHÔNG TEXT THÊM):
{{
    "foods": [
        {{
            "name": "",
            "meal_type": "breakfast|lunch|dinner|snack",
            "calories": 0,
            "protein": 0,
            "carbs": 0,
            "fat": 0,
            "description": "<mô tả ngắn về món ăn và nguyên liệu chính, nhấn mạnh yếu tố healthy>"
        }}
    ]
}}
"""

    try:
        client = get_openai_client()
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "Bạn là một chuyên gia dinh dưỡng. Trả về chỉ JSON, không có text thêm."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7,
            response_format={"type": "json_object"}
        )

        # Parse response
        response_content = response.choices[0].message.content
        food_plan = json.loads(response_content)

        # Validate response structure
        if "foods" not in food_plan:
            logger.error("Invalid food plan structure from OpenAI")
            abort(500, message="Invalid food plan structure received from AI")

        # Process foods and create food logs
        created_food_items = []
        created_logs = []
        
        # If full day (all), process all items. Else limit to 1.
        items_to_process = food_plan["foods"] if is_full_day else food_plan["foods"][:1]

        for food_data in items_to_process:
            # Validate required fields
            required_fields = ["name", "meal_type", "calories"]
            if not all(field in food_data for field in required_fields):
                logger.error(f"Missing required fields in food data: {food_data}")
                continue

            # Validate meal type
            if meal_type and not is_full_day:
                # specific meal type requested
                if hasattr(meal_type, 'value'):
                     meal_type_enum = meal_type
                     meal_type_str = meal_type.value
                else:
                     # It's a string, likely from schema passing "breakfast" etc
                     try:
                        meal_type_enum = MealTypeEnum(meal_type)
                        meal_type_str = meal_type
                     except ValueError:
                        # Fallback try to use what AI says if user input was weird, or just error
                        logger.error(f"Invalid meal type input: {meal_type}")
                        continue
            else:
                try:
                    meal_type_str = food_data["meal_type"].lower()
                    meal_type_enum = MealTypeEnum(meal_type_str)
                except (ValueError, AttributeError) as e:
                    logger.error(f"Invalid meal type: {food_data.get('meal_type')}, error: {e}")
                    continue

            # check exist
            existing_log = FoodLogModel.query.filter_by(
                user_id=user_id,
                log_date=target_date,
                meal_type=meal_type_enum,
                name=food_data["name"]
            ).first()

            if not existing_log:
                food_log = FoodLogModel(
                    user_id=user_id,
                    log_date=target_date,
                    meal_type=meal_type_enum,
                    name=food_data["name"],
                    calories=food_data["calories"],
                    protein=food_data.get("protein"),
                    carbs=food_data.get("carbs"),
                    fat=food_data.get("fat"),
                    quantity=1.0  # Default quantity
                )
                db.session.add(food_log)
                created_logs.append(food_log)
            else:
                existing_log.calories = food_data["calories"]
                existing_log.protein = food_data.get("protein")
                existing_log.carbs = food_data.get("carbs")
                existing_log.fat = food_data.get("fat")
                existing_log.quantity = 1.0
                created_logs.append(existing_log)

            created_food_items.append({
                "log": created_logs[-1],
                "name": food_data["name"],
                "meal_type": meal_type_str,
                "calories": food_data["calories"],
                "description": food_data.get("description", "")
            })

        # Commit all changes
        db.session.commit()

        logger.info(f"Food plan created successfully for user_id: {user_id} on {target_date}")
        
        return {
            "date": target_date.isoformat(),
            "foods": created_food_items
        }

    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse OpenAI response: {e}")
        db.session.rollback()
        abort(500, message="Failed to parse AI response")
    except Exception as e:
        logger.error(f"Failed to generate food plan: {e}")
        db.session.rollback()
        abort(500, message=f"Failed to generate food plan: {str(e)}")
