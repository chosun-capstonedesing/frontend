import axios from 'axios';

const API_BASE = "http://13.125.214.199:8000";

//회원가입 요청
export const registerUser = async (userInfo) => {
  try {
    const res = await axios.post(`${API_BASE}/users/register`, userInfo, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return res.data;
  } catch (error) {
    // 에러 응답 받기
    if (error.response) {
      return {
        success: false,
        status: error.response.status,
        message: error.response.data.detail || "알 수 없는 오류"
      };
    } else {
      return {
        success: false,
        message: "서버에 연결할 수 없습니다"
      };
    }
  }
};

//로그인 요청
export const loginUser = async (loginInfo) => {
  try {
    const res = await axios.post(`${API_BASE}/users/login`, loginInfo, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    //fake token
    const responseData = {
        ...res.data, 
        token: res.data.token || "FAKE_DEV_TOKEN_12345"
    };

    return {
      success: true,
      data: responseData
    };
  } catch (error) {
    if (error.response) {
      return {
        success: false,
        status: error.response.status,
        message: error.response.data.detail || "로그인 실패"
      };
    } else {
      return {
        success: false,
        message: "서버에 연결할 수 없습니다"
      };
    }
  }
};