import { UAParser } from 'ua-parser-js';

export function displayVisibility(visibility: string){
    
    if(visibility === "password_protected") return "Protected"
    else return visibility.charAt(0).toUpperCase() + visibility.slice(1)
}


export function parseUserAgent(userAgent: string): string {
    const parser = new UAParser(userAgent);
    const browser = parser.getBrowser().name;
    const os = parser.getOS().name;
    return `${browser} - ${os}`;
}