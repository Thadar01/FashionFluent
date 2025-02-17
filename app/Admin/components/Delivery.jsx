"use client";
import React, { useState } from "react";
import { NavBar } from "./commoms/NavBar";
import CreateDelivery from "./CreateDelivery";
const Delivery = () => {
  const [isModel, setIsModel] = useState(false);
  return (
    <div className="flex">
      <NavBar />
      <div>
        <div>
          <div>Delivery</div>
          <button onClick={() => setIsModel(!isModel)}>Add</button>
        </div>
        {isModel && (
          <div>
            <CreateDelivery setIsModel={setIsModel} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Delivery;
