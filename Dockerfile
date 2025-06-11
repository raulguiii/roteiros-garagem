# Usa imagem leve com Python
FROM python:3.12-slim

# Define diretório de trabalho
WORKDIR /app

# Copia tudo
COPY . .

# Instala dependências
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Expõe a porta usada pelo Railway (essencial)
EXPOSE 8080

# Executa o app com Gunicorn
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:8080"]
