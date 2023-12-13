import { addDays, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function dateComponents(daysToAdd: number): {
    day: number,
    month: string,
    year: number,
    abbreMonth: string,
    initialMonth: string,
    initialYear: number,
    initialDay: number
} {
    const currentDate = new Date()
    const newDate = addDays(currentDate, daysToAdd)

    const day = newDate.getDate()
    const month = format(newDate, 'MMMM', { locale: ptBR })
    const year = newDate.getFullYear()
    const abbreMonth = format(newDate, 'MMM', { locale: ptBR })

    const initialDay = currentDate.getDate()
    const initialMonth = format(currentDate, 'MMMM', { locale: ptBR })
    const initialYear = currentDate.getFullYear()

    return { day, month, year, initialMonth, abbreMonth, initialYear, initialDay }
}