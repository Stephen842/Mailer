import requests
from django.conf import settings

def send_telegram_message(chat_id, message):
    '''Send text message to our telegram user via the our telegram bot.'''
    url = f'https://api.telegram.org/bot{settings.TELEGRAM_BOT_TOKEN}/sendMessage'
    payload = {'chat_id': chat_id, 'text': message, 'parse_mode': 'HTML'}
    requests.post(url, data=payload)