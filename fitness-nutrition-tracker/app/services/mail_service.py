import mailtrap as mt
import os

def send_email(to_email: str, subject: str, html_content: str):
    message = mt.Mail(
        sender=mt.Address(email="hello@demomailtrap.co", name="FitTracker AI"),
        to=[mt.Address(email=to_email)],
        subject=subject,
        html=html_content,
        category="Integration Test",
    )
    
    try:
        api_key = os.environ.get("SEND_EMAIL_API_KEY")
        print(api_key)
        client = mt.MailtrapClient(token=api_key)
        response = client.send(message)
        return {
            "status": "success",
            "message": response
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }
