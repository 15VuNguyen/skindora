export function removeVietnameseTones(s: string){
    return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/Đ/g, "D")
    .replace(/đ/g, "d")
}