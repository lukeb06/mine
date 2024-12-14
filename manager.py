import subprocess
from time import sleep
import os

JOIN_OFFSET = 5
CAMS = ["cam0.bat", "cam1.bat", "cam2.bat"]
SERVER = "server.bat"


def create_background_process(bat_file: str):
    return subprocess.Popen(f"start {bat_file}", shell=True)


if __name__ == "__main__":
    create_background_process(SERVER)

    for cam in CAMS:
        create_background_process(cam)
        sleep(JOIN_OFFSET)

    while True:
        input_str = input("> ")
        if input_str == "q":
            exit(0)
            break
