export function displayVisibility(visibility: string){
    
    if(visibility === "password_protected") return "Protected"
    else return visibility.charAt(0).toUpperCase() + visibility.slice(1)
}