from pusher_push_notifications import PushNotifications
from datetime import datetime

beams_client = PushNotifications(
    instance_id = 'c01adb5e-665c-4769-9c3b-31a2799ac0bd',
    secret_key = 'BAE9DD68574F7571DBE990303E99EE681391262A9EAE078E21E3BD514F76AFE8',
)

response = beams_client.publish_to_interests(
    interests = ['XYZ0001-S0003'],
    publish_body = {
        'web': {
            'notification': {
                'title': 'Floor Mopping Alert',
                'body': 'Floor mopping is occuring in your store at',
                'deep_link': 'https://app.nonagon.ai',
                'icon': 'https://nonagon-client-notification-video-archive.s3.ap-south-1.amazonaws.com/Images/download.png'
            },
            # 'data': {
            #     'image': 'https://nonagon-client-notification-video-archive.s3.ap-south-1.amazonaws.com/Images/download.png'
            # },
        },
    },
)