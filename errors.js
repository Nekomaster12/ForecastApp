export class CityInputError extends Error{
    constructor(message){
        super(message)
        this.name = "CityInputError"
    }
}