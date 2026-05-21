export interface IUser {
    id: number;
    name: string;
    email: string;
    password: string;
    age: number;
    is_active?: boolean;
    role?: string;
}
