from database import get_db_connection
import json

def get_all_projects(user_id=None):
    conn = get_db_connection()
    try:
        rows = conn.execute('''
            SELECT p.*, u.name as created_by_name, u.email as created_by_email 
            FROM projects p
            JOIN users u ON p.created_by = u.id
            ORDER BY p.created_at DESC
        ''').fetchall()
        projects = []
        for r in rows:
            project = dict(r)
            for field in ['team_members', 'tags', 'skills_required', 'team_roles', 'images', 'project_links', 'partners', 'highlights']:
                if project.get(field):
                    try:
                        project[field] = json.loads(project[field])
                    except:
                        project[field] = project[field].split(',') if isinstance(project[field], str) else project[field]
                else:
                    project[field] = []
            
            if user_id:
                # Check if this user has applied
                app = conn.execute('SELECT id FROM project_applications WHERE project_id = ? AND student_id = ?', (project['id'], user_id)).fetchone()
                project['has_applied'] = True if app else False
            
            # Fetch positions
            pos_rows = conn.execute('SELECT * FROM project_positions WHERE project_id = ?', (project['id'],)).fetchall()
            positions = []
            for pr in pos_rows:
                pos = dict(pr)
                if pos.get('required_skills'):
                    try:
                        pos['required_skills'] = json.loads(pos['required_skills'])
                    except:
                        pos['required_skills'] = pos['required_skills'].split(',') if isinstance(pos['required_skills'], str) else []
                positions.append(pos)
            project['positions'] = positions
            
            projects.append(project)
        return projects
    finally:
        conn.close()

def get_project_by_id(project_id, user_id=None):
    conn = get_db_connection()
    try:
        row = conn.execute('''
            SELECT p.*, u.name as created_by_name, u.email as created_by_email 
            FROM projects p
            JOIN users u ON p.created_by = u.id
            WHERE p.id = ?
        ''', (project_id,)).fetchone()
        
        if not row: return None
        
        project = dict(row)
        for field in ['team_members', 'tags', 'skills_required', 'team_roles', 'images', 'project_links', 'partners', 'highlights']:
            if project.get(field):
                try:
                    project[field] = json.loads(project[field])
                except:
                    project[field] = project[field].split(',') if isinstance(project[field], str) else project[field]
            else:
                project[field] = []
        
        if user_id:
            app = conn.execute('SELECT id FROM project_applications WHERE project_id = ? AND student_id = ?', (project_id, user_id)).fetchone()
            project['has_applied'] = True if app else False
            
        pos_rows = conn.execute('SELECT * FROM project_positions WHERE project_id = ?', (project_id,)).fetchall()
        positions = []
        for pr in pos_rows:
            pos = dict(pr)
            if pos.get('required_skills'):
                try:
                    pos['required_skills'] = json.loads(pos['required_skills'])
                except:
                    pos['required_skills'] = pos['required_skills'].split(',') if isinstance(pos['required_skills'], str) else []
            positions.append(pos)
        project['positions'] = positions
            
        return project
    finally:
        conn.close()

def apply_to_project(project_id, student_id, data):
    conn = get_db_connection()
    try:
        # Check if already applied
        existing = conn.execute('SELECT id FROM project_applications WHERE project_id = ? AND student_id = ?', (project_id, student_id)).fetchone()
        if existing:
            return False, "Already applied to this project", 400
            
        # Get position ID (simplification, assuming first available or passed from frontend)
        # For our MVP, the position logic is somewhat simplified in the seed data
        position_id = data.get('position_id')
        
        conn.execute('''
            INSERT INTO project_applications (project_id, student_id, position_id, message, status, has_team)
            VALUES (?, ?, ?, ?, 'pending', ?)
        ''', (project_id, student_id, position_id, data.get('message', ''), data.get('has_team', False)))
        conn.commit()
        return True, "Application submitted", 200
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        conn.close()

def get_application_status(project_id, user_id):
    conn = get_db_connection()
    try:
        apps = conn.execute('SELECT id, status, position_id, created_at FROM project_applications WHERE project_id = ? AND student_id = ?', (project_id, user_id)).fetchall()
        if apps:
            applications = {}
            for app in apps:
                applications[str(app['position_id'] or 'legacy')] = {
                    "application_id": app['id'],
                    "status": app['status'],
                    "applied_at": app['created_at']
                }
            
            first = apps[0]
            return {
                "has_applied": True,
                "application_id": first['id'],
                "status": first['status'],
                "applied_at": first['created_at'],
                "applications": applications
            }
        return {"has_applied": False, "applications": {}}
    finally:
        conn.close()
