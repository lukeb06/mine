import subprocess
from time import sleep

JOIN_OFFSET = 5
CAMS = ["cam0.bat", "cam1.bat", "cam2.bat"]
SERVER = "server.bat"


def start(file: str):
    subprocess.Popen(file)


if __name__ == "__main__":
    start(SERVER)

    for cam in CAMS:
        start(cam)
        sleep(JOIN_OFFSET)
