from typing import Any
from pathlib import Path
from dataclasses import dataclass

import emails
from jinja2 import Template

from app.core.config import settings


@dataclass 
class EmailData:
    html_content: str
    subject: str


def render_email_template(*, template_name: str, context: dict[str, Any]) -> str:
    template_str = (
        Path(__file__).parent / "email-templates" / "build" / template_name
    ).read_text()
    html_content = Template(template_str).render(context)
    return html_content


def send_email(
    *,
    email_to: str,
    subject: str = "",
    html_content: str,

) -> None:
    assert settings.emails_enabled, "no provided configuration for email variables"
    message = emails.Message(
        subject=subject,
        html = html_content,
        mail_from=(settings.EMAILS_FROM_NAME, settings.EMAILS_FROM_EMAIL)
    )

    print("PREPARATIOOOOOOOOOOOOOOOOOOOOOOOOON")

    smtp_options = {"host": settings.SMTP_HOST, "port": settings.SMTP_PORT}
    
    if settings.SMTP_TLS:
        smtp_options["tls"] = True
    elif settings.SMTP_SSL:
        smtp_options["ssl"] = True
    

    if settings.SMTP_USER:
        smtp_options["user"] = settings.SMTP_USER
    print(settings.SMTP_USER)
    if settings.SMTP_PASSWORD:
        smtp_options["password"] = settings.SMTP_PASSWORD
    print("SENDINNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNG")
    print(smtp_options)
    response = message.send(to=email_to, smtp=smtp_options)
    print(response)

def generate_new_account_email(
    email_to: str,
    username: str,
    password: str,
) -> EmailData:
    
    project_name = settings.PROJECT_NAME

    subject = f"{project_name} - New account for user {username}"
    html_content = render_email_template(
        template_name="new_account.html",
        context={
            "project_name": project_name,
            "username": username,
            "password": password,
            "email": email_to,
            "link": "http://localhost:5173/"
        }
    )

    return EmailData(html_content, subject)

