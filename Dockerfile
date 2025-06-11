# Use uma imagem oficial do Python
FROM python:3.12-slim

# Define diretório de trabalho
WORKDIR /app

# Copia todos os arquivos
COPY . /app

# Instala dependências
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Expõe a porta usada pelo Railway
EXPOSE 8080

# Comando de execução
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:8080"]
