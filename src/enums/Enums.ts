export enum PagesEnum {
    HOME = "HOME",
    AUTH = "AUTH",
    REG = "REG",
    ACCOUNT = "ACCOUNT",
    ANALYTIC = "ANALYTIC",
    DRIVER = "DRIVER",
    FAQ = "FAQ",
    ORDER = "ORDER"
}

export enum AuthTypes {
    NONE = "NONE",
    USER = "USER",
    DRIVER = "DRIVER",
    ANALYTIC = "ANALYTIC"
}

export enum AuthActionTypes {
    SET_AUTH = "SET_AUTH"
}

export enum OrderTypes {
    DURATION = "Продолжительность",
    DESTINATION = "Расстояние"
}

export enum CarStatuses {
    FREE = "Доступен",
    BUSY = "Не доступен",
    UNDER_REPAIR = "В ремонте"
}
export enum DriverStatuses {
    READY = "Доступен",
    DELETED = "Удален",
    BUSY = "Занят"
}

export enum UserStatuses {
    ACTIVE = "Активен",
    DELETED = "Удален",
}

export enum Statuses {
    CREATED = "Создан",
    ASSIGNED = "Назначен",
    IN_PROGRESS = "В процессе",
    IN_PROCESSING = "В обработке",
    CLOSED = "Закрыт",
    ABORTED = "Отменен"
}

export enum Types {
    BUS = "Автобус",
    PASSENGER_COMFORT = "Комфорт",
    PASSENGER_BUSINESS = "Бизнес",
    PASSENGER_ECONOMY = "Эконом",
    MINIVAN = "Миниван",
    LIMOUSINE = "Лимузин"
}



export enum Categories {
    A = "A",
    B = "B",
    C = "C",
    D = "D",
    M = "M"
}