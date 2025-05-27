import os
import mysql.connector
from flask import Flask, render_template, request, redirect, url_for, session, flash

app = Flask(__name__)
app.secret_key = "chave_secreta"

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
            session['usuario'] = usuario['nome_completo']
            return redirect(url_for('index'))
        else:
            flash("CPF ou senha incorretos.")
            return redirect(url_for('login'))

    return render_template('login.html')


# Página principal após login
@app.route('/index')
def index():
    if 'usuario' not in session:
        return redirect(url_for('login'))
    return render_template('index.html', usuario=session['usuario'])


# Logout
@app.route('/logout')
def logout():
    session.pop('usuario', None)
    return redirect(url_for('login'))


if __name__ == '__main__':
    app.run(debug=True)
