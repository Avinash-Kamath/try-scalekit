from flask import Flask, request, jsonify
import time
import os
import uuid
import hashlib
import scalekit.client

app = Flask(__name__)

# Initialize Scalekit client
scalekit = scalekit.client.ScalekitClient(
    client_id="skc_53814741268693059",
    client_secret="test_ZBeqNRT3fQjTfGzFmFObkTDMlMbndBjZ3jOBADvd5OONZFBWzeOBmXiWwjlGLqCu",
    env_url="https://kindle-dev.scalekit.cloud",
)

@app.route("/api/python")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/api/get-identifier", methods=["POST"])
def get_identifier():
    try:
        # Generate a random UUID
        random_uuid = str(uuid.uuid4())
        
        # Hash the client_id
        client_id = "skc_53814741268693059"
        client_hash = hashlib.sha256(client_id.encode()).hexdigest()[:8]
        
        # Combine UUID + client_id hash
        identifier = f"{random_uuid}-{client_hash}"
        
        return jsonify({
            "success": True,
            "identifier": identifier,
            "message": "Identifier generated successfully"
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route("/api/get-auth-link", methods=["POST"])
def get_auth_link():
    try:
        data = request.get_json()
        identifier = data.get('identifier')
        
        if not identifier:
            return jsonify({
                "success": False,
                "error": "Identifier is required"
            }), 400
        
        connect = scalekit.connect
        link_response = connect.get_authorization_link(
            connection_name="GMAIL",
            identifier=identifier,
        )
        
        return jsonify({
            "success": True,
            "auth_link": link_response.link,
            "message": "Authorization link generated successfully"
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route("/api/check-connection-status", methods=["POST"])
def check_connection_status():
    try:
        data = request.get_json()
        identifier = data.get('identifier')
        
        if not identifier:
            return jsonify({
                "success": False,
                "error": "Identifier is required"
            }), 400
        
        connect = scalekit.connect
        accounts_response = connect.list_connected_accounts(
            connection_name="GMAIL",
            identifier=identifier,
            provider = "GMAIL",
        )
        

        # Check if any accounts are active
        for i, account in enumerate(accounts_response.connected_accounts):
                
                if hasattr(account, 'status') and account.status == "ACTIVE":
                    return jsonify({
                        "success": True,
                        "status": "active",
                        "connected": True,
                    })

                else:
                    return jsonify({
                        "success": True,
                        "status": "pending",
                        "connected": False,
                        "message": "Connection not yet active"
                    })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e),
            "status": "error",
            "connected": False
        }), 500

@app.route("/api/fetch-email", methods=["POST"])
def fetch_email():
    print("=== FETCH EMAIL API CALLED ===")
    try:
        print("Getting scalekit connect instance...")
        connect = scalekit.connect
        print(f"Connect instance: {connect}")
        
        print("Calling execute_tool with parameters:")
        print(f"  tool_name: GMAIL.FETCH_EMAILS")
        print(f"  identifier: avinash.kamath@scalekit.com")
        print(f"  tool_input: {{'max_results': 1}}")
        
        response = connect.execute_tool(
            tool_name="GMAIL.FETCH_EMAILS",
            identifier="avinash.kamath@scalekit.com",
            tool_input={
                "max_results": 1
            },
        )
        
        print(f"Raw response: {response}")
        print(f"Response type: {type(response)}")
        print(f"Response dir: {dir(response)}")
        
        # Extract email data from response
        if hasattr(response, 'data') and response.data:
            print(f"Response has data: {response.data}")
            print(f"Data length: {len(response.data)}")
            email_data = response.data[0]  # Get first email
            print(f"First email data: {email_data}")
            print(f"Email data type: {type(email_data)}")
            print(f"Email data dir: {dir(email_data)}")
            
            result = {
                "success": True,
                "message": "Email fetched successfully",
                "email": {
                    "id": getattr(email_data, 'id', 'N/A'),
                    "from": getattr(email_data, 'sender', 'N/A'), 
                    "to": getattr(email_data, 'recipient', 'N/A'),
                    "subject": getattr(email_data, 'subject', 'N/A'),
                    "date": getattr(email_data, 'date', 'N/A'),
                    "body": getattr(email_data, 'body', 'N/A')[:500] + '...' if hasattr(email_data, 'body') else 'No body content'
                }
            }
            print(f"Returning result: {result}")
            return jsonify(result)
        else:
            print("No data in response, returning no emails found")
            result = {
                "success": True,
                "message": "No emails found",
                "email": {
                    "id": "no_emails",
                    "from": "N/A",
                    "to": "N/A", 
                    "subject": "No emails found",
                    "date": "N/A",
                    "body": "No emails were found in the account."
                }
            }
            print(f"Returning no emails result: {result}")
            return jsonify(result)
            
    except Exception as e:
        print(f"ERROR in fetch_email: {str(e)}")
        print(f"Error type: {type(e)}")
        import traceback
        print(f"Full traceback: {traceback.format_exc()}")
        
        return jsonify({
            "success": False,
            "error": str(e),
            "error_type": str(type(e))
        }), 500