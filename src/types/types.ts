export interface SystemError extends Error {
    code: string;
    errno?: number;
    syscall?: string;
    path?: string;
}