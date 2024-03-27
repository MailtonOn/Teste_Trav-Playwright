export interface EmployeeModel {
    name: string
    firstName: string
    lastName: string
    nationality: string
    passport: string
    RG: string
    birthdate: string
    function: String
    email: string
}

export interface ToInviteModel {
    function: string
}

export interface GoTravelModel {
    dataIdValue: string,
    button: string,
    button1: string,
    titleAir: string,
    titleCar: string
}

export interface TravelModel {
    partida: string
    code1: string
    destino: string
    code2: string
    goDay: number
    backDay: number
}
