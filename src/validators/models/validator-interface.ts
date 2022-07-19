export interface ValidatorInterface<T> {
    validate(obj: T): T;
}
