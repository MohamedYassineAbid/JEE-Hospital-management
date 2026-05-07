export interface Doctor {
    id?: number;
    name: string;
    email: string;
    specialty: string;
    username: string;
    workContact?: string;
    dayOff?: string;
    morningCapacity?: number;
    afternoonCapacity?: number;
}
