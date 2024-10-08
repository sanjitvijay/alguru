import React from "react";

function UserChat({ question }) {
  return (
    <div className="flex prose justify-end">
      <div className="card bg-gray-200 dark:bg-slate-700 p-3 max-w-sm">
        {question}
      </div>
    </div>
  );
}

export default UserChat;
