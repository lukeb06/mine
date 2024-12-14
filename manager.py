import subprocess
from time import sleep
import os
import signal
from multiprocessing import Process
from typing import List

JOIN_OFFSET = 5
CAM_COUNT = 3
SERVER = "node server.js"

CAMS = []
for i in range(CAM_COUNT):
    CAMS.append(f"node index.js {i}")


def create_background_process(cmd: str):
    return subprocess.run(f"{cmd}")


def create_processes() -> list[Process]:
    procs: list[Process] = []

    procs.append(Process(target=create_background_process, args=(SERVER,)))

    for cam in CAMS:
        procs.append(Process(target=create_background_process, args=(cam,)))
        sleep(JOIN_OFFSET)

    for proc in procs:
        proc.start()

    return procs


def kill_process(proc: Process):
    proc.kill()


if __name__ == "__main__":
    processes = create_processes()

    while True:
        input_str = input("> ")
        if input_str.startswith("/"):
            if input_str == "/quit":
                for process in processes:
                    kill_process(process)
                break
            elif input_str == "/restart":
                for process in processes:
                    kill_process(process)
                processes = create_processes()
            elif input_str == "/help":
                print("Available commands:")
                print("/quit - quit the server")
                print("/restart - restart the server")
                print("/help - show this message")
            else:
                print("Unknwn command")
