from flask import Flask, request, jsonify
import time
import os
import uuid
import hashlib
import json
from google.protobuf.json_format import MessageToJson, MessageToDict
from google.protobuf.struct_pb2 import Struct
import scalekit.client
from dotenv import load_dotenv
from gmai_parser import parse_gmail_simple


load_dotenv()
app = Flask(__name__)

# Initialize Scalekit client
scalekit = scalekit.client.ScalekitClient(
    client_id=os.getenv("SCALEKIT_CLIENT_ID"),
    client_secret=os.getenv("SCALEKIT_CLIENT_SECRET"),
    env_url=os.getenv("SCALEKIT_ENV_URL"),
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
        client_id = os.getenv("SCALEKIT_CLIENT_ID", "skc_53814741268693059")
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
        
        response = scalekit.connected_accounts.list_connected_accounts(
            connector="GMAIL",
            identifier=identifier,
            provider="GMAIL"
        )
        
        # Check if the response is OK
        if response[1].code().name != "OK":
            return jsonify({
                "success": False,
                "error": f"API call failed with status: {response[1].code().name}",
                "status": "error",
                "connected": False
            }), 500
        
        accounts_response = response[0]
        
        if hasattr(accounts_response, 'connected_accounts'):
            connected_accounts = accounts_response.connected_accounts
        else:
            return jsonify({
                "success": True,
                "status": "pending",
                "connected": False,
                "message": "No connected_accounts attribute in response"
            })

        # Check if any accounts are active
        for i, account in enumerate(connected_accounts):
                # Check if account status is ACTIVE (could be enum or string)
                is_active = (account.status == 1 or
                           str(account.status) == "ACTIVE" or
                           (hasattr(account.status, 'name') and account.status.name == "ACTIVE"))
                
                if is_active:
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
    try:
        data = request.get_json()
        identifier = data.get('identifier')

        response = scalekit.connect.execute_tool(
            tool_name="GMAIL.FETCH_MAILS",
            identifier=identifier,
            tool_input={
                "max_results" : 1
            },
        )
        parsed_response = parse_gmail_simple(response.data)
        
        if not identifier:
            return jsonify({
                "success": False,
                "error": "Identifier is required"
            }), 400
        
        # Return dummy Google security email response
        return jsonify({
            "success": True,
            "message": "Email fetched successfully",
            "email": parsed_response
        })
            
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e),
            "error_type": str(type(e))
        }), 500