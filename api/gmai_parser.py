import base64
import re
import html

def parse_gmail_simple(gmail_data):
    """
    Simple function to extract basic email info from Gmail API response dict
    Args: gmail_data (dict) - Gmail API response as a dictionary
    Returns: dict with id, subject, from, and body
    """
    try:
        # Handle both single message and messages list
        if 'messages' in gmail_data:
            # If it's a list response, parse the first message
            if gmail_data['messages']:
                message = gmail_data['messages'][0]
            else:
                return {"id": "", "subject": "", "from": "", "body": ""}
        else:
            # Single message response
            message = gmail_data

        # Get basic info
        email_id = message.get('id', '')
        payload = message.get('payload', {})
        headers = payload.get('headers', [])

        # Extract headers
        subject = ""
        from_email = ""

        for header in headers:
            name = header.get('name', '').lower()
            value = header.get('value', '')

            if name == 'subject':
                subject = value
            elif name == 'from':
                from_email = value

        # Extract body
        body = extract_body_simple(payload)

        return {
            "id": email_id,
            "subject": subject,
            "from": from_email,
            "body": body
        }

    except Exception as e:
        raise Exception(f"Error parsing email: {e}") from e

def extract_body_simple(payload):
    """Extract email body content from your Gmail API response format"""

    def decode_base64_data(data):
        """Decode base64 data safely"""
        try:
            # Add padding if needed
            missing_padding = len(data) % 4
            if missing_padding:
                data += '=' * (4 - missing_padding)
            return base64.urlsafe_b64decode(data).decode('utf-8')
        except Exception as e:
            raise Exception(f"Base64 decode error: {e}") from e

    def clean_html(html_content):
        """Convert HTML to plain text"""
        # Remove HTML tags
        text = re.sub('<.*?>', '', html_content)
        # Decode HTML entities
        text = html.unescape(text)
        # Clean up whitespace and newlines
        text = re.sub(r'\s+', ' ', text)
        text = re.sub(r'\n\s*\n', '\n\n', text)
        return text.strip()

    # Check if payload has parts (multipart message)
    if 'parts' in payload:
        plain_text = ""
        html_text = ""

        for part in payload['parts']:
            mime_type = part.get('mimeType', '')

            # Check if this part has body data
            if 'body' in part and 'data' in part['body']:
                part_data = decode_base64_data(part['body']['data'])

                if 'text/plain' in mime_type:
                    plain_text = part_data
                elif 'text/html' in mime_type:
                    html_text = part_data

            # Check nested parts (for complex multipart messages)
            elif 'parts' in part:
                nested_body = extract_body_simple(part)
                if nested_body and not plain_text:
                    plain_text = nested_body

        # Return plain text if available, otherwise cleaned HTML
        if plain_text:
            return plain_text
        elif html_text:
            return clean_html(html_text)

    # Check if payload has body data directly (simple message)
    elif 'body' in payload and 'data' in payload['body']:
        body_data = decode_base64_data(payload['body']['data'])
        mime_type = payload.get('mimeType', '')

        if 'text/plain' in mime_type:
            return body_data
        elif 'text/html' in mime_type:
            return clean_html(body_data)

    return ""