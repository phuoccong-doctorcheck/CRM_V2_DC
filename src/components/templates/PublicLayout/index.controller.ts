// Hàm kết nối fb
export const handleLogin = () => {
    window.FB.login((response: any) => {
      if (response.authResponse) {
        const userAccessToken = response.authResponse.accessToken;
        window.FB.api(`/me?fields=id,name,accounts&access_token=${userAccessToken}`, { access_token: userAccessToken }, (resp: any) => {
          console.log("🚀 ~ file: index.tsx:242 ~ window.FB.api ~ resp:", resp)
        });
      } else {
        console.log("Login cancelled");
      }
    });
};

// Hàm getUserMedia này sử dụng API getUserMedia của trình duyệt để yêu cầu quyền truy cập vào thiết bị âm thanh (microphone) của người dùng
export const getUserMedia = async () => {
    try {
      navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then((stream) => {// Xử lý stream audio ở đây
        })
        .catch((error) => { // Xử lý lỗi nếu không thể truy cập thiết bị âm thanh
          return;
        });
    } catch (error) {    // Xử lý lỗi nếu có lỗi xảy ra trong quá trình gọi getUserMedia

      return;
    }
  };