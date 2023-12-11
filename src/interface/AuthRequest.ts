interface User {
    id: string;
    personalCode: string;
    camdigikeyId: string;
    username: string;
    lastnameKh: string;
    firstnameKh: string;
    lastnameEn: string;
    firstnameEn: string;
    gender: string;
    email: string;
    enabled: boolean;
    status: string;
    roles: UserRole[];
    department: null | string; // Adjust the type based on the actual type of "department"
}

interface UserRole {
    id: string;
    code: string;
    description: string;
    enabled: boolean;
}

export interface AuthRequest extends Request {
    user: User
}