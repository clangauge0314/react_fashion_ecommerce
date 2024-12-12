import React from "react";

const LoadingSpinner = () => {
  const spinnerStyle = {
    display: "inline-block",
    width: "64px",
    height: "64px",
    border: "4px solid rgba(0, 0, 255, 0.2)", // 회색 반투명 테두리
    borderTop: "4px solid blue", // 파란색 상단 테두리
    borderRadius: "50%", // 원형
    animation: "spin 1s linear infinite", // 회전 애니메이션
  };

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh", // 화면 전체 높이
  };

  return (
    <div style={containerStyle}>
      <div
        style={{
          ...spinnerStyle,
          animation: "spin 1s linear infinite",
          "@keyframes spin": {
            from: { transform: "rotate(0deg)" },
            to: { transform: "rotate(360deg)" },
          },
        }}
      />
    </div>
  );
};

export default LoadingSpinner;
