import React from "react";

function InfoCard({ icon, text }) {
  return (
    <div className="card border-base-content border-2 p-3 w-36 h-16 flex-col justify-center">
      <div className="flex items-center justify-between">
        {icon}
        <p className="text-md ml-5">{text}</p>
      </div>
    </div>
  );
}

export default InfoCard;
