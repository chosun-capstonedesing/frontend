const isActuallyLoggedIn = () => {
    if (import.meta.env.VITE_SKIP_AUTH === "true") return true;
    const token = localStorage.getItem("access_token");
    return !!token;
};

export default isActuallyLoggedIn;
export const isLoggedIn = isActuallyLoggedIn;