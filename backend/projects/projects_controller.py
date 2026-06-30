from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from core_middleware import get_user_id_from_jwt
from . import projects_model

projects_bp = Blueprint('projects_bp', __name__)

@projects_bp.route('/projects', methods=['GET'])
def get_projects():
    try:
        # We allow unauthenticated users to view projects, but if they have a JWT, we can check has_applied
        # We can extract token manually if it exists, but for simplicity, we just return projects
        user_id = None
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            from flask_jwt_extended import decode_token
            try:
                token = auth_header.split(' ')[1]
                decoded = decode_token(token)
                user_id = int(decoded['sub'].split('_')[1])
            except:
                pass
                
        projects = projects_model.get_all_projects(user_id)
        return jsonify(projects), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@projects_bp.route('/projects/<int:project_id>', methods=['GET'])
def get_project_detail(project_id):
    try:
        user_id = None
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            from flask_jwt_extended import decode_token
            try:
                token = auth_header.split(' ')[1]
                decoded = decode_token(token)
                user_id = int(decoded['sub'].split('_')[1])
            except:
                pass
                
        project = projects_model.get_project_by_id(project_id, user_id)
        if not project:
            return jsonify({'error': 'Project not found'}), 404
        return jsonify(project), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@projects_bp.route('/projects/<int:project_id>/applications', methods=['POST'])
@jwt_required()
def apply_project(project_id):
    try:
        user_id = get_user_id_from_jwt()
        data = request.get_json() or {}
        success, msg, code = projects_model.apply_to_project(project_id, user_id, data)
        if success:
            return jsonify({'message': msg}), code
        return jsonify({'error': msg}), code
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@projects_bp.route('/projects/<int:project_id>/application-status', methods=['GET'])
@jwt_required()
def application_status(project_id):
    try:
        user_id = get_user_id_from_jwt()
        status_data = projects_model.get_application_status(project_id, user_id)
        return jsonify(status_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
