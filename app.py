import os
import mysql.connector
from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
from datetime import datetime, timedelta
from werkzeug.utils import secure_filename
from flask import g

app = Flask(__name__)
app.permanent_session_lifetime = timedelta(hours=1)
app.secret_key = "chave_secreta"

UPLOAD_FOLDER = 'uploads/atestados'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = os.path.join('static', 'atestados')

# Configuração do banco de dados com porta correta da Railway
db_config = {
    "host": "caboose.proxy.rlwy.net",
    "port": 19070,  # PORTA CORRETA
    "user": "root",
    "password": "LwvHcipVoMGESFrvxxqNjccNJeZPYTsn",
    "database": "db_transporte_adaptado_semecti"
}

# Verificação de sessão antes de cada requisição
@app.before_request
def verificar_sessao():
    rotas_livres = ['login', 'static', 'teste']
    if request.endpoint is None or any(request.endpoint.startswith(r) for r in rotas_livres):
        return
    if 'nome_completo' not in session:
        flash("Sua sessão expirou. Por favor, faça login novamente.")
        return redirect(url_for('login'))

# Página de login
@app.route('/', methods=['GET', 'POST'])
def teste():
    return "Servidor funcionando!"


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
    
@app.route('/api/comunicados/count')
def contar_comunicados():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM comunicados")
        (count,) = cursor.fetchone()
        cursor.close()
        conn.close()

        return jsonify({'success': True, 'count': count})

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
            SELECT id, titulo, descricao, 
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
    

@app.route('/api/mensagem-direta/<int:mensagem_id>', methods=['DELETE'])
def deletar_mensagem_direta(mensagem_id):
    if 'nome_completo' not in session or 'id_usuario' not in session:
        return jsonify({'success': False, 'message': 'Não autorizado'}), 401

    id_usuario_logado = session.get('id_usuario')

    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        # Verifica se a mensagem pertence ao usuário logado
        cursor.execute("""
            SELECT id FROM mensagens_diretas
            WHERE id = %s AND id_usuario_destino = %s
        """, (mensagem_id, id_usuario_logado))
        resultado = cursor.fetchone()

        if not resultado:
            cursor.close()
            conn.close()
            return jsonify({'success': False, 'message': 'Mensagem não encontrada ou não autorizada'}), 404

        # Deleta a mensagem
        cursor.execute("""
            DELETE FROM mensagens_diretas
            WHERE id = %s
        """, (mensagem_id,))
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({'success': True})

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


@app.route('/api/mensagens-diretas/count')
def contar_mensagens_diretas():
    if 'id_usuario' not in session:
        return jsonify({'success': False, 'message': 'Não autorizado'}), 401

    id_usuario_logado = session['id_usuario']

    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("""
            SELECT COUNT(*) FROM mensagens_diretas
            WHERE id_usuario_destino = %s
        """, (id_usuario_logado,))
        (count,) = cursor.fetchone()
        cursor.close()
        conn.close()

        return jsonify({'success': True, 'count': count})

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


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
    

#                                               R O T E I R O    1      A P A E

#                                              GET ALUNOS ROTEIRO 1 APAE
@app.route('/api/alunos_roteiro1apae')
def api_alunos_roteiro1apae():
    if 'nome_completo' not in session or 'cargo' not in session:
        return jsonify({"erro": "Não autorizado"}), 401

    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)

    query = """
        SELECT * FROM alunos_roteiro1apae
        ORDER BY FIELD(horario, 
            '07:00 - 11:00',
            '08:00 - 12:00',
            '11:00 - 15:00',
            '13:00 - 17:00',
            '15:00 - 19:00',
            '19:00 - 23:00'
        ),
        escola ASC
    """
    cursor.execute(query)
    alunos = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify({"alunos": alunos})

#                                              POST NOVO ALUNO ROTEIRO 1 APAE
@app.route('/api/alunos_roteiro1apae', methods=['POST'])
def adicionar_aluno_roteiro1apae():
    data = request.get_json()

    escola = data.get("escola")
    serie = data.get("serie")
    nome_completo = data.get("nome_completo")
    horario = data.get("horario")
    endereco = data.get("endereco")
    responsavel = data.get("responsavel")
    cid = data.get("cid")

    if not all([escola, serie, nome_completo, horario, endereco, responsavel, cid]):
        return jsonify({"erro": "Dados incompletos"}), 400

    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO alunos_roteiro1apae (escola, serie, nome_completo, horario, endereco, responsavel, cid)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """, (escola, serie, nome_completo, horario, endereco, responsavel, cid))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"status": "aluno_adicionado"}), 201

#                                           DELETE ALUNO ROTEIRO 1 APAE
@app.route('/api/alunos_roteiro1apae/<nome_completo>', methods=['DELETE'])
def remover_aluno_roteiro1apae(nome_completo):
    if 'nome_completo' not in session or 'cargo' not in session:
        return jsonify({"erro": "Não autorizado"}), 401

    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()

    # Verificar se existe
    cursor.execute("SELECT id FROM alunos_roteiro1apae WHERE nome_completo = %s", (nome_completo,))
    aluno = cursor.fetchone()

    if not aluno:
        cursor.close()
        conn.close()
        return jsonify({"erro": "Aluno não encontrado"}), 404

    aluno_id = aluno[0]

    cursor.execute("DELETE FROM observacoes_alunos_roteiro1apae WHERE aluno_id = %s", (aluno_id,))

    cursor.execute("DELETE FROM alunos_roteiro1apae WHERE id = %s", (aluno_id,))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"status": "aluno_removido"})

#                                              EDITAR ALUNOS ROTEIRO 1 APAE
@app.route('/api/buscar_aluno_roteiro1apae', methods=['GET'])
def buscar_aluno_roteiro1apae():
    nome = request.args.get('nome')

    if not nome:
        return jsonify({"erro": "Nome não fornecido"}), 400

    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM alunos_roteiro1apae WHERE nome_completo = %s", (nome,))
    aluno = cursor.fetchone()
    cursor.close()
    conn.close()

    if aluno:
        return jsonify({"aluno": aluno})
    else:
        return jsonify({"erro": "Aluno não encontrado"}), 404

@app.route('/api/editar_aluno_roteiro1apae', methods=['POST'])
def editar_aluno_roteiro1apae():
    data = request.get_json()

    nome = data.get("nome")
    escola = data.get("escola")
    serie = data.get("serie")
    horario = data.get("horario")
    endereco = data.get("endereco")
    responsavel = data.get("responsavel")
    cid = data.get("cid")

    if not nome:
        return jsonify({"erro": "Nome do aluno não fornecido"}), 400

    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE alunos_roteiro1apae
        SET escola = %s, serie = %s, horario = %s, endereco = %s, responsavel = %s, cid = %s
        WHERE nome_completo = %s
    """, (escola, serie, horario, endereco, responsavel, cid, nome))
    conn.commit()
    cursor.close()
    conn.close()

    if cursor.rowcount == 0:
        return jsonify({"erro": "Aluno não encontrado"}), 404

    return jsonify({"status": "aluno_atualizado"}), 200


#                                              GET OBSERVACOES ROTEIRO 1 APAE
@app.route('/api/observacoes/<int:aluno_id>')
def get_observacoes(aluno_id):
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT observacao FROM observacoes_alunos_roteiro1apae WHERE aluno_id = %s ORDER BY id DESC", (aluno_id,))
    observacoes = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify({"observacoes": observacoes})

#                                              POST OBSERVACOES ROTEIRO 1 APAE
@app.route('/api/observacoes', methods=['POST'])
def post_observacao():
    data = request.get_json()
    aluno_id = data.get("aluno_id")
    observacao = data.get("observacao")

    if not aluno_id or not observacao:
        return jsonify({"error": "Dados inválidos"}), 400

    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()
    cursor.execute("INSERT INTO observacoes_alunos_roteiro1apae (aluno_id, observacao) VALUES (%s, %s)", (aluno_id, observacao))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"status": "ok"})

@app.route('/api/frequencia_roteiro1apae', methods=['POST'])
def salvar_frequencia_roteiro1apae():
    data = request.get_json()
    frequencias = data.get('frequencias', [])

    if not frequencias:
        return jsonify({"erro": "Nenhum dado recebido"}), 400

    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()

    for item in frequencias:
        nome = item.get("nome_completo")
        data_frequencia = item.get("data")
        status = item.get("status")

        if not (nome and data_frequencia and status):
            continue

        # Buscar o ID do aluno
        cursor.execute("SELECT id FROM alunos_roteiro1apae WHERE nome_completo = %s", (nome,))
        aluno = cursor.fetchone()
        if aluno:
            aluno_id = aluno[0]

            # Tenta inserir ou ignora se já existir (por causa da UNIQUE KEY)
            try:
                cursor.execute("""
                    INSERT INTO frequencia_roteiro1apae (id_aluno, data, status)
                    VALUES (%s, %s, %s)
                """, (aluno_id, data_frequencia, status))
            except mysql.connector.Error as err:
                # Se já existir (violação de UNIQUE), apenas continue
                if err.errno == 1062:
                    continue
                else:
                    print("Erro ao inserir frequência:", err)

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"status": "ok"})

@app.route('/api/frequencia_roteiro1apae/<string:roteiro>', methods=['GET'])
def buscar_frequencias_roteiro1apae(roteiro):
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)

    if roteiro != "roteiro1apae":
        return jsonify([])

    cursor.execute("""
        SELECT f.id_aluno, a.nome_completo, f.data, f.status
        FROM frequencia_roteiro1apae f
        JOIN alunos_roteiro1apae a ON f.id_aluno = a.id
    """)
    resultados = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(resultados)




#                                               R O T E I R O    3      N O A 

#                                              GET ALUNOS ROTEIRO 3 NOA
@app.route('/api/alunos_roteiro3noa')
def api_alunos_roteiro3noa():
    if 'nome_completo' not in session or 'cargo' not in session:
        return jsonify({"erro": "Não autorizado"}), 401

    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)

    query = """
        SELECT * FROM alunos_roteiro3noa
        ORDER BY FIELD(horario, 
            '07:00 - 11:00',
            '08:00 - 12:00',
            '11:00 - 15:00',
            '13:00 - 17:00',
            '15:00 - 19:00',
            '19:00 - 23:00'
        ),
        escola ASC
    """
    cursor.execute(query)
    alunos = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify({"alunos": alunos})

#                                               GET observações roteiro 3 NOA
@app.route('/api/observacoes3noa/<int:aluno_id>')
def get_observacoes_3noa(aluno_id):
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT observacao FROM observacoes_alunos_roteiro3noa WHERE aluno_id = %s ORDER BY id DESC", (aluno_id,))
    observacoes = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify({"observacoes": observacoes})

#                                               POST observações roteiro 3 NOA
@app.route('/api/observacoes3noa', methods=['POST'])
def post_observacao_3noa():
    data = request.get_json()
    aluno_id = data.get("aluno_id")
    observacao = data.get("observacao")

    if not aluno_id or not observacao:
        return jsonify({"error": "Dados inválidos"}), 400

    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()
    cursor.execute("INSERT INTO observacoes_alunos_roteiro3noa (aluno_id, observacao) VALUES (%s, %s)", (aluno_id, observacao))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"status": "ok"})

# POST - Adicionar aluno roteiro 3 NOA
@app.route('/api/alunos_roteiro3noa', methods=['POST'])
def adicionar_aluno_roteiro3noa():
    data = request.get_json()

    campos = ['escola', 'serie', 'nome_completo', 'horario', 'endereco', 'responsavel', 'cid']
    if not all(campo in data for campo in campos):
        return jsonify({"erro": "Dados incompletos"}), 400

    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO alunos_roteiro3noa (escola, serie, nome_completo, horario, endereco, responsavel, cid)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """, (
        data['escola'], data['serie'], data['nome_completo'],
        data['horario'], data['endereco'], data['responsavel'], data['cid']
    ))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"status": "Aluno adicionado com sucesso"})

#                           DELETE - Remover aluno roteiro 3 NOA
@app.route('/api/alunos_roteiro3noa/<string:nome_completo>', methods=['DELETE'])
def remover_aluno_roteiro3noa(nome_completo):
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM alunos_roteiro3noa WHERE nome_completo = %s", (nome_completo,))
    aluno = cursor.fetchone()

    if not aluno:
        cursor.close()
        conn.close()
        return jsonify({"erro": "Aluno não encontrado"}), 404

    cursor.execute("DELETE FROM alunos_roteiro3noa WHERE nome_completo = %s", (nome_completo,))
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"status": "Aluno removido com sucesso"})

#                               EDITAR ALUNO - ROTEIRO 3NOA 
@app.route('/api/buscar_aluno_roteiro3noa', methods=['GET'])
def buscar_aluno_roteiro3noa():
    nome = request.args.get('nome')

    if not nome:
        return jsonify({"erro": "Nome não fornecido"}), 400

    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM alunos_roteiro3noa WHERE nome_completo = %s", (nome,))
    aluno = cursor.fetchone()
    cursor.close()
    conn.close()

    if aluno:
        return jsonify({"aluno": aluno})
    else:
        return jsonify({"erro": "Aluno não encontrado"}), 404

@app.route('/api/editar_aluno_roteiro3noa', methods=['POST'])
def editar_aluno_roteiro3noa():
    data = request.get_json()

    nome = data.get("nome")
    escola = data.get("escola")
    serie = data.get("serie")
    horario = data.get("horario")
    endereco = data.get("endereco")
    responsavel = data.get("responsavel")
    cid = data.get("cid")

    if not nome:
        return jsonify({"erro": "Nome do aluno não fornecido"}), 400

    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE alunos_roteiro3noa
        SET escola = %s, serie = %s, horario = %s, endereco = %s, responsavel = %s, cid = %s
        WHERE nome_completo = %s
    """, (escola, serie, horario, endereco, responsavel, cid, nome))
    conn.commit()

    linhas_afetadas = cursor.rowcount

    cursor.close()
    conn.close()

    if linhas_afetadas == 0:
        return jsonify({"erro": "Aluno não encontrado"}), 404

    return jsonify({"status": "aluno_atualizado"}), 200


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)