"use client";
import React, { useState } from "react";
import { NavBar } from "./commoms/NavBar";
import CreatePromotion from "./CreatePromotion";

const Promotions = () => {
  const [isModel, setIsModel] = useState(false);

  return (
    <div className="flex">
      <NavBar />
      <div className="flex flex-col">
        <div>
          <div>Promotions</div>
          <button onClick={() => setIsModel(!isModel)}>Add</button>
        </div>
        {isModel && (
          <div>
            <CreatePromotion setIsModel={setIsModel} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Promotions;
