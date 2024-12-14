import subprocess
from time import sleep
import os

JOIN_OFFSET = 5
CAMS = ["cam0.bat", "cam1.bat", "cam2.bat"]
SERVER = "server.bat"


def create_background_process(bat_file: str):
    return subprocess.Popen(f"{bat_file}")


def create_processes():
    processes = []

    processes.append(create_background_process(SERVER))

    for cam in CAMS:
        processes.append(create_background_process(cam))
        sleep(JOIN_OFFSET)

    return processes


if __name__ == "__main__":
    processes = create_processes()

    while True:
        input_str = input("> ")
        if input_str.startswith("/"):
            if input_str == "/quit":
                for process in processes:
                    process.kill()
            elif input_str == "/restart":
                for process in processes:
                    process.kill()
                processes = create_processes()
            elif input_str == "/help":
                print("Available commands:")
                print("/quit - quit the server")
                print("/restart - restart the server")
                print("/help - show this message")
            else:
                print("Unknwn command")
