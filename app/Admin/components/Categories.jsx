"use client";
import React, { useState } from "react";
import { NavBar } from "./commoms/NavBar";
import CreateCategory from "./CreateCategory";

const Categories = () => {
  const [isModel, setIsModel] = useState(false);

  return (
    <div className="flex">
      <NavBar />
      <div className="flex flex-col">
        <div>
          <div>Categories</div>
          <button onClick={() => setIsModel(!isModel)}>Add</button>
        </div>
        {isModel && (
          <div>
            <CreateCategory setIsModel={setIsModel} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
