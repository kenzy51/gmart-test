export const history = {
    navigate: null
}

export function clearToken() {
    localStorage.removeItem('token')
}

export function setToken(token) {
    localStorage.setItem('token', JSON.stringify(token))
}

export function getToken() {
    try {
        return JSON.parse(localStorage.getItem('token'))
    } catch (err) {
        return null
    }
}

export function isSidebarCollapsed(isCollapsed) {
    localStorage.setItem('isSidebarCollapsed', JSON.stringify(isCollapsed))
}

export function getIsSidebarCollapsed() {
    try {
        return JSON.parse(localStorage.getItem('isSidebarCollapsed'))
    } catch (err) {
        return null
    }
}
