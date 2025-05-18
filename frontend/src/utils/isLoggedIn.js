const isActuallyLoggedIn = () => {
    if (import.meta.env.DEV) return true;
    const token = localStorage.getItem("access_token");
    return !!token;
};

export default isActuallyLoggedIn;
export const isLoggedIn = isActuallyLoggedIn;