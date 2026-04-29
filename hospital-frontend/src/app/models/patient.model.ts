export interface Patient {
    id?: number;
    nom: string;
    dateNaissance: Date | string;
    malade: boolean;
    adresse: string;
    codePostal: string;
    numeroTelephone: string;
    titre: 'MMe' | 'Mr';
}

export interface PageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}
