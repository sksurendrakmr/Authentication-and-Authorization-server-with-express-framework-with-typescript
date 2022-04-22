export type UserType = {
    name:string;
    password:string;
    email:string;
    isAdmin?:boolean;
}

export type UserMethods = {
    generateToken:()=>string;
}