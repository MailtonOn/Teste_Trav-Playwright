export interface EmployeeModel {
    name: string
    fistName: string
    lastName: string
    nationality: string
    passport: string
    RG: string
    birthdate: string
}

export interface GoTravelModel {
    dataIdValue: string,
    button: string,
    title: string
}

export interface TravelModel {
    partida: string
    code1: string
    destino: string
    goDay: number
    backDay: number
}
