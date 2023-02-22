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