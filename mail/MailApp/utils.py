import requests
from django.conf import settings

def send_telegram_message(chat_id, message):
    '''Send text message to our telegram user via our telegram bot.'''
    url = f'https://api.telegram.org/bot{settings.TELEGRAM_BOT_TOKEN}/sendMessage'
    payload = {
        'chat_id': chat_id,
        'text': message,
        'parse_mode': 'HTML'
    }
    response = requests.post(url, data=payload)

    try:
        result = response.json()
    except Exception:
        result = {'ok': False, 'error': response.text}

    if not response.ok or not result.get('ok', False):
        print('Telegram send failed:', '''result''')
    else:
        print('Telegram send success:', '''result''')
    
    return result