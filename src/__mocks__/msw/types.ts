export interface ResponseData<T> {
    data: T;
    status: number;
    errorMessage?: string;
}

export function isResponseData<T extends object>(object: ResponseData<T> | T): object is ResponseData<T> {
    if (!object) {
        return false;
    }
    return "status" in object;
}
