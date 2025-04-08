import React from "react";

function LogoutButton() {
    const handleLogout = () => {
        //TODO: 로그아웃 로직 제작
        console.log('Logout');
        if(onLogout) onLogout();
    };

    return (
        <button onClick={handleLogout} className="text-sm hover:underline text-red-500">
            Logout
        </button>
    );
}

export default LogoutButton;