import sys
import json
import io

# força UTF-8
sys.stdin = io.TextIOWrapper(sys.stdin.buffer, encoding='utf-8')
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

print(json.dumps({"msg": "Python iniciado e pronto!"}), flush=True)

for line in sys.stdin:
    try:
        data = json.loads(line.strip())
        # Retorna um objeto JSON limpo, sem embedar dict dentro de string
        response = {
            "resposta": "Oi Electron, recebi mensagem",
            "conteudo": data  # envia o dict direto
        }
        print(json.dumps(response), flush=True)
    except Exception as e:
        print(json.dumps({"erro": str(e)}), flush=True)
