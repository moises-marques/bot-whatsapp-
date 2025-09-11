import pywhatkit
import qrcode
import time
from pyautogui import press

# Número do seu WhatsApp
MEU_WHATSAPP = "+552992981067373"  # formato internacional

# Cardápio / respostas automáticas
respostas = {
    "oi": "Olá! Seja bem-vindo ao nosso atendimento 😊",
    "suco": "Temos sucos de: Laranja, Abacaxi e Morango 🥤",
    "pizza": "Temos pizzas de: Calabresa, Frango com Catupiry e Margherita 🍕",
    "refrigerante": "Temos refrigerantes: Coca-Cola, Guaraná e Fanta 🥤",
    "hamburguer": "Temos hambúrgueres: X-Burguer, X-Egg e X-Salada 🍔",
    "salgado": "Temos salgados: Coxinha, Kibe, Pastel 🥟",
    "tchau": "Obrigado pelo contato! Até logo 👋"
}

def enviar_mensagem(numero, mensagem):
    """
    Envia uma mensagem usando pywhatkit.
    """
    pywhatkit.sendwhatmsg_instantly(numero, mensagem, wait_time=3)
    time.sleep(1)
    press("enter")

def processar_mensagem(msg_recebida):
    """
    Verifica a mensagem recebida e retorna a resposta automática.
    """
    msg_recebida = msg_recebida.lower()
    for chave, resposta in respostas.items():
        if chave in msg_recebida:
            return resposta
    return None

def iniciar_bot():
    print("BOT iniciado! Aguarde novas mensagens...")
    while True:
        msg = input("Digite a mensagem do cliente (simulando entrada): ")
        resposta = processar_mensagem(msg)
        if resposta:
            enviar_mensagem(MEU_WHATSAPP, resposta)
            print(f"Bot respondeu: {resposta}")
        else:
            print("Nenhuma resposta automática encontrada.")

if __name__ == "__main__":
    iniciar_bot()