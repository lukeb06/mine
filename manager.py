import subprocess
from time import sleep
import os
import signal
from multiprocessing import Process

JOIN_OFFSET = 5
CAM_COUNT = 3
SERVER = "node server.js"

CAMS = []
for i in range(CAM_COUNT):
    CAMS.append(f"node index.js {i}")


def create_background_process(cmd: str):
    while True:
        subprocess.run(f"{cmd}")
        sleep(JOIN_OFFSET * 2)


def create_processes():
    procs = []

    proc = Process(target=create_background_process, args=(SERVER,))
    proc.start()
    procs.append(proc)

    for cam in CAMS:
        proc = Process(target=create_background_process, args=(cam,))
        proc.start()
        procs.append(proc)
        sleep(JOIN_OFFSET)

    return procs


if __name__ == "__main__":
    processes = create_processes()
