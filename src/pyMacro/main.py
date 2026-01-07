import sys
import os
import json
import pyautogui
import time
import threading
import keyboard

configDist = 300
configPorc = 0.6
configDur = 0.3
configDir = "up"
configTime = 0.5




# Caminho das imagens
pathImg = os.path.join(os.path.dirname(__file__), "../electron/image/imagens.json")

startBot = False

# Carrega todas as imagens do JSON
with open(pathImg, "r", encoding="utf-8") as f:
    allImg = json.load(f)

# -------------------------
# Funções de automação
# -------------------------
def clickAll(pathImg, configPorc):
    try:
        locations = list(pyautogui.locateAllOnScreen(pathImg, confidence=configPorc))
        if locations:
            for loc in locations:
                if not startBot:
                    return False
                pyautogui.click(loc)
                time.sleep(configTime)
            return True
        else:
            return False
    except Exception as e:
        print(json.dumps({"error": f"Erro ao procurar {pathImg}: {e}"}))
        sys.stdout.flush()
        return False

def monitorKey():
    global startBot
    keyboard.wait('esc')
    startBot = False

def screenS(direction, configDist, configDur):
    screen_width, screen_height = pyautogui.size()
    start_x = screen_width // 2
    start_y = screen_height // 2
    end_y = start_y - configDist if direction == 'up' else start_y + configDist

    pyautogui.moveTo(start_x, start_y)
    pyautogui.mouseDown()
    pyautogui.moveTo(start_x, end_y, configDur=configDur)
    pyautogui.mouseUp()
    time.sleep(0.3)

def move_until_target_or_end(items_list, target_image=None, direction='down', max_empty=5):
    empty_counter = 0

    while startBot:
        found_any = False
        for item in items_list:
            if clickAll(item):
                found_any = True

        if target_image and clickAll(target_image):
            print(json.dumps({"status": f"Imagem {target_image} encontrada"}))
            sys.stdout.flush()
            return True  

        if not found_any:
            empty_counter += 1
            if empty_counter >= max_empty:
                print(json.dumps({"status": f"Não há mais itens {direction}"}))
                sys.stdout.flush()
                break
        else:
            empty_counter = 0

        screenS(direction=direction)

    return False

def automation_loop(items_list, inicial_image, final_image):
    global startBot
    while startBot:
        if move_until_target_or_end(items_list, target_image=final_image, direction='down'):
            print(json.dumps({"status": "Chegou no final"}))
            sys.stdout.flush()

        if not startBot:
            break

        if move_until_target_or_end(items_list, target_image=inicial_image, direction='up'):
            print(json.dumps({"status": "Voltou ao início"}))
            sys.stdout.flush()

# -------------------------
# Loop principal para receber comandos do Electron
# -------------------------
def main():
    global startBot
    print(json.dumps({"status": "Python pronto"}))
    sys.stdout.flush()


    for line in sys.stdin:
        try:
            cmd = json.loads(line.strip())
            action = cmd.get("action")

            # Separando imagens de início/final e itens
            items_list = []
            inicial_image = None
            final_image = None
            for img_path in allImg:
                lower_name = os.path.basename(img_path).lower()
                if "inicio" in lower_name:
                    inicial_image = img_path
                elif "final" in lower_name:
                    final_image = img_path
                else:
                    items_list.append(img_path)

            if action == "start":
                if not startBot:
                    threading.Thread(target=monitorKey, daemon=True).start()
                    startBot = True
                    threading.Thread(
                        target=automation_loop,
                        args=(items_list, inicial_image, final_image),
                        daemon=True
                    ).start()
                    print(json.dumps({"status": "Iniciando automação..."}))
                    sys.stdout.flush()

            elif action == "stop":
                startBot = False
                print(json.dumps({"status": "Automação parada"}), flush = True)
                sys.stdout.flush()

        except Exception as e:
            print(json.dumps({"error": str(e)}))
            sys.stdout.flush()

if __name__ == "__main__":
    main()
