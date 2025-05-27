import os
import mysql.connector
from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
from datetime import datetime
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.secret_key = "chave_secreta"

UPLOAD_FOLDER = 'uploads/atestados'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = os.path.join('static', 'atestados')

# Configuração do banco de dados
db_config = {
    "host": "localhost",
    "user": "root",
    "password": "raulgui123!",
    "database": "db_transporte_adaptado"
}

# Página de login (rota inicial)
@app.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        cpf = request.form['cpf']
        senha = request.form['senha']

        # Conexão com o banco
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        query = "SELECT * FROM usuarios WHERE cpf = %s AND senha = %s"
        cursor.execute(query, (cpf, senha))
        usuario = cursor.fetchone()
        cursor.close()
        conn.close()

        if usuario:
            session['id_usuario'] = usuario['id']  # <== aqui, salvar o id do usuário logado
            session['nome_completo'] = usuario['nome_completo']
            session['cargo'] = usuario['cargo']
            session['roteiro'] = usuario['roteiro']
            session['destino'] = usuario['destino']
            return redirect(url_for('index'))
        else:
            flash("CPF ou senha incorretos.")
            return render_template('login.html', erro=True)

    return render_template('login.html')


# Página principal após login
@app.route('/index')
def index():
    if 'nome_completo' not in session or 'cargo' not in session:
        return redirect(url_for('login'))
    return render_template('index.html',
                           nome_completo=session['nome_completo'], 
                           cargo=session['cargo'],
                           roteiro=session['roteiro'],
                           destino=session['destino'])


# Logout
@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))


# API que retorna os usuários em JSON (usada pelo AJAX)
@app.route('/api/usuarios')
def api_usuarios():
    if 'nome_completo' not in session or 'cargo' not in session:
        return jsonify({"erro": "Não autorizado"}), 401

    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM usuarios")
    lista_usuarios = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify({"usuarios": lista_usuarios})


@app.route('/api/comunicado', methods=['POST'])
def salvar_comunicado():
    data = request.get_json()
    titulo = data.get('titulo')
    descricao = data.get('descricao')
    data_hora = data.get('dataHora')  # vem como string: '2025-05-27T14:00'

    if not titulo or not descricao or not data_hora:
        return jsonify({'success': False, 'message': 'Campos obrigatórios não preenchidos'}), 400

    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO comunicados (titulo, descricao, data_hora)
            VALUES (%s, %s, %s)
        """, (titulo, descricao, data_hora.replace("T", " ")))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
    

@app.route('/api/comunicados', methods=['GET'])
def listar_comunicados():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT titulo, descricao, DATE_FORMAT(data_hora, '%d/%m/%Y às %H:%i') as data_hora_formatada FROM comunicados ORDER BY data_hora DESC LIMIT 10")
        comunicados = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify({'success': True, 'comunicados': comunicados})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


@app.route('/api/mensagem-direta', methods=['POST'])
def salvar_mensagem_direta():
    if 'nome_completo' not in session:
        return jsonify({'success': False, 'message': 'Não autorizado'}), 401

    data = request.get_json()
    titulo = data.get('titulo')
    descricao = data.get('descricao')
    data_hora = data.get('dataHora')
    id_usuario_destino = data.get('usuarioDestino')

    if not titulo or not descricao or not data_hora or not id_usuario_destino:
        return jsonify({'success': False, 'message': 'Todos os campos são obrigatórios'}), 400

    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO mensagens_diretas (titulo, descricao, data_hora, id_usuario_destino)
            VALUES (%s, %s, %s, %s)
        """, (titulo, descricao, data_hora.replace("T", " "), id_usuario_destino))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
    

@app.route('/api/mensagens-diretas')
def api_mensagens_diretas():
    if 'nome_completo' not in session or 'cargo' not in session:
        return jsonify({"success": False, "message": "Não autorizado"}), 401

    # Suponha que você tenha o id do usuário no session
    id_usuario_logado = session.get('id_usuario')
    if not id_usuario_logado:
        return jsonify({"success": False, "message": "ID usuário não encontrado"}), 401

    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT titulo, descricao, 
                DATE_FORMAT(data_hora, '%d/%m/%Y às %H:%i') as data_hora_formatada
            FROM mensagens_diretas
            WHERE id_usuario_destino = %s
            ORDER BY data_hora DESC
            LIMIT 20
        """, (id_usuario_logado,))
        mensagens = cursor.fetchall()
        cursor.close()
        conn.close()

        return jsonify({"success": True, "mensagens": mensagens})

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500    

    

@app.route('/api/atestados')
def api_atestados():
    if 'nome_completo' not in session or 'cargo' not in session:
        return jsonify([])

    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM atestados")
    atestados = cursor.fetchall()
    cursor.close()
    conn.close()

    # Adiciona o caminho completo do arquivo para cada item
    for atestado in atestados:
        atestado['arquivo'] = url_for('static', filename=f'atestados/{atestado["arquivo"]}')

    return jsonify(atestados)


@app.route('/api/atestados', methods=['POST'])
def salvar_atestado():
    if 'aluno' not in request.form or 'monitora' not in request.form or 'file' not in request.files:
        return jsonify({'success': False, 'message': 'Todos os campos são obrigatórios.'}), 400

    aluno = request.form['aluno'].strip()
    monitora = request.form['monitora'].strip()
    file = request.files['file']

    if file.filename == '':
        return jsonify({'success': False, 'message': 'Nenhum arquivo selecionado.'}), 400

    try:
        filename = secure_filename(file.filename)
        caminho_completo = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(caminho_completo)

        # Gravar no banco de dados
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO atestados (aluno, monitora, arquivo)
            VALUES (%s, %s, %s)
        """, (aluno, monitora, filename))
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({'success': True, 'message': 'Atestado salvo com sucesso!'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


@app.route('/api/ocorrencias')
def api_ocorrencias():
    if 'nome_completo' not in session or 'cargo' not in session:
        return {"error": "Não autorizado"}, 401

    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM ocorrencias ORDER BY data DESC")
    lista_ocorrencias = cursor.fetchall()
    cursor.close()
    conn.close()

    return {"ocorrencias": lista_ocorrencias}

@app.route('/api/ocorrencias', methods=['POST'])
def salvar_ocorrencia():
    data = request.get_json()

    data_ocorrencia = data.get('data')  # formato: '2025-05-27'
    monitora = data.get('monitora')
    motorista = data.get('motorista')
    aluno = data.get('aluno')
    escola = data.get('escola')
    descricao = data.get('descricao')

    if not data_ocorrencia or not descricao:
        return jsonify({'success': False, 'message': 'Data e descrição são obrigatórias.'}), 400

    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO ocorrencias (data, monitora, motorista, aluno, escola, descricao)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (data_ocorrencia, monitora, motorista, aluno, escola, descricao))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500



if __name__ == '__main__':
    app.run(debug=True)
