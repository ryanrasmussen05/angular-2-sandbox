import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'rr-monty-hall',
    templateUrl: './monty-hall.component.html',
    styleUrls: ['./monty-hall.component.scss']
})

export class MontyHallComponent implements OnInit {
    doors: number[] = [1, 2, 3];
    winningDoor: number;
    selectedDoor: number;
    openDoors: number[];
    gameState: string;
    finishText: string;

    ngOnInit(): void {
        this.initializeGame();
    }

    initializeGame(): void {
        this.getRandomWinner();
        this.openDoors = [];
        this.selectedDoor = undefined;
        this.finishText = "";
        this.gameState = 'initial';
    }

    getRandomWinner(): void {
        this.winningDoor = Math.floor(Math.random() * 3) + 1;
    }

    doorClick(doorNumber: number): void {
        if(this.gameState === 'initial') {
            this.selectedDoor = doorNumber;
            this.gameState = 'openLoser';
        }
    }

    openRandomLoser(): void {
        let losingDoors: number[] = [];
        let randomRatio = Math.random();

        this.doors.forEach((door) => {
            if(door !== this.winningDoor && door !== this.selectedDoor) {
                losingDoors.push(door);
            }
        });

        if(randomRatio < 0.5 || losingDoors.length === 1) {
            this.openDoor(losingDoors[0]);
        } else {
            this.openDoor(losingDoors[1]);
        }

        this.gameState = 'stickOrSwitch';
    }

    getOtherAvailableDoor(): number {
        let returnDoor: number = 0;

        this.doors.forEach(door => {
            if(door !== this.selectedDoor && !this.openDoors.some(x => x === door)) {
                returnDoor = door;
            }
        });

        return returnDoor;
    }

    switchDoor(shouldSwitch: boolean): void {
        if(shouldSwitch) {
            this.selectedDoor = this.getOtherAvailableDoor();
        }
        this.gameState = 'reveal';
    }

    finishGame(): void {
        let win = this.selectedDoor === this.winningDoor;
        this.finishText = win ? "You Win!" : "You Lost";

        this.doors.forEach(door => {
            this.openDoor(door);
        });

        this.gameState = 'gameOver';
    }

    isDoorOpen(doorNumber: number): boolean {
        //test whether SOME element passes test
        return this.openDoors.some(x => x === doorNumber);
    }

    getImage(doorNumber: number) {
        if(this.winningDoor) {
            return require('../../../public/images/' + (doorNumber ===  this.winningDoor ? 'money.png' : 'donkey.png'));
        }
    }

    private openDoor(doorNumber: number): void {
        this.openDoors.push(doorNumber);
    }
}
