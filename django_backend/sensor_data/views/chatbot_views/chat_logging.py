
# chat_logging.py
import uuid
from django.utils import timezone
from sensor_data.models import ChatSession, ChatInteraction
import logging
import re

logger = logging.getLogger(__name__)


## Utility functions for chat logging, used to remove emojis etc. from the messages
def sanitize_text(text):
    # Remove emoji and non-BMP Unicode characters
    return re.sub(r'[\U00010000-\U0010FFFF]', '', text)


def get_or_create_session(session_id):
    """Get existing session or create new one"""
    if not session_id:
        session_id = str(uuid.uuid4())
    
    session, created = ChatSession.objects.get_or_create(
        session_id=session_id
    )
    
    if not created:
        # Update the session timestamp to show it's still active
        session.updated_at = timezone.now()
        session.save(update_fields=['updated_at'])
    
    return session, session_id

def log_chat_interaction(session, user_message, bot_response):
    """Log a simple chat interaction to the database"""
    try:
        user_message = sanitize_text(user_message)
        bot_response = sanitize_text(bot_response)

        interaction = ChatInteraction.objects.create(
            session=session,
            user_message=user_message,
            bot_response=bot_response
        )
        return interaction
    except Exception as e:
        logger.error(f"Failed to log chat interaction: {e}")
        return None


def get_chat_history(session_id, limit=10):
    """Get recent chat history for a session"""
    try:
        session = ChatSession.objects.get(session_id=session_id)
        interactions = session.interactions.all()[:limit]
        
        history = []
        for interaction in interactions:
            history.append({
                'user_message': interaction.user_message,
                'bot_response': interaction.bot_response,
                'timestamp': interaction.created_at,
            })
        
        return history
    except ChatSession.DoesNotExist:
        return []