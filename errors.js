export class CityInputError extends Error{
    constructor(message){
        super(message)
        this.name = "CityInputError"
    }
}

export class fetchError extends Error{
    constructor(message){
        super(message)
        this.name = "fetchError"
    }
}

export class cityAddError extends Error{
    constructor(city){
        super(`City ${city} is already in favourites.`)
        this.name = "cityAddError"
    }
}