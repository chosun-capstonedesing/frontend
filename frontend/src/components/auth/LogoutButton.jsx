import React from "react";

function LogoutButton() {
    const hanndleLogout = () => {
        //TODO: 로그아웃 로직 제작
        console.log('Logout');
        if(onLogout) onLogout();
    };

    return (
        <button onClick={hanndleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
            Logout
        </button>
    );
}

export default LogoutButton;